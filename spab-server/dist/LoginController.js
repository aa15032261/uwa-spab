"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const tslib_1 = require("tslib");
// import config file
require("./Config");
const crypto = require("crypto");
class LoginController {
    /**
     * LoginController manages login sessions of the application
     */
    constructor() { }
    /**
     * Get login middleware for express
     *
     * @returns - Login middleware for express
     */
    getLoginHandler() {
        return (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let spabReq = req;
            let sessionStruct;
            if (req.session && req.session[SESSION_NAME]) {
                sessionStruct = req.session[SESSION_NAME];
            }
            yield this.getLoginStatus(spabReq, sessionStruct);
            next();
        });
    }
    /**
     * Get login status of a session. The status is attached to obj.
     *
     * @param {any & LoginStatus} obj - Object for receiving login status
     * @param {SessionStruct | undefined} sessionStruct - The login session
     */
    getLoginStatus(obj, sessionStruct) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            obj.loginStatus = {
                loggedIn: false,
                lastLogin: 0,
                userId: '',
                reason: 'unknown'
            };
            try {
                if (!this._pool) {
                    throw 'db not ready';
                }
                if (!sessionStruct) {
                    throw 'invalid session';
                }
                if (!sessionStruct.data) {
                    throw 'invalid session';
                }
                let sessionObj = sessionStruct.data;
                if (!sessionObj.userId) {
                    throw 'invalid session';
                }
                let userObj = (yield this._pool.query('SELECT * FROM users WHERE _id = $1', [sessionObj.userId])).rows[0];
                if (!userObj) {
                    throw 'not found';
                }
                if (!sessionObj.lastLogin || sessionObj.lastLogin < userObj.lastModified) {
                    throw 'expired';
                }
                obj.loginStatus.loggedIn = true;
                obj.loginStatus.userId = sessionObj.userId;
                obj.loginStatus.lastLogin = sessionObj.lastLogin;
                obj.loginStatus.reason = undefined;
            }
            catch (e) {
                obj.loginStatus.reason = e.toString();
            }
        });
    }
    /**
     * Verifies user password using scrypt
     *
     * @param {string} clrPw - Clear text password
     * @param {string} scryptedPw - Scrypt encrypted password
     * @returns {boolean} - True if the password is valid, otherwise, false
     */
    _verifyUserPass(clrPw, scryptedPw) {
        try {
            let [saltHex, pwHex] = scryptedPw.split(":");
            let salt = Buffer.from(saltHex, 'base64');
            let pw = crypto.scryptSync(clrPw + USER_PASSWORD_SALT, salt, 64, {
                cost: 16384,
                blockSize: 8,
                parallelization: 1
            }).toString('base64');
            return pwHex === pw;
        }
        catch (e) {
        }
        return false;
    }
    /**
     * Handles user login
     *
     * @param {string} email - User email address
     * @param {string} clrPw - Clear text password
     * @param {SessionStruct} sessionStruct - A session for receiving login session data
     * @returns {Promise<string | undefined>} - Login error (undefined if login is successful)
     */
    login(email, clrPw, sessionStruct) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._pool) {
                    throw 'internal error';
                }
                let userObj = (yield this._pool.query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
                if (!userObj) {
                    return 'invalid credential';
                }
                // Hardcoded max failed login attempt
                if (userObj.failedAttempt > 5) {
                    return 'account disabled';
                }
                let curTime = (new Date()).getTime();
                // If the password is correct, 
                // clears failed attempt count and updates last login timestamp,
                // and also update login session data
                if (this._verifyUserPass(clrPw, userObj.pass)) {
                    if (!sessionStruct.data) {
                        sessionStruct.data = {};
                    }
                    let sessionObj = sessionStruct.data;
                    sessionObj.userId = userObj._id;
                    sessionObj.lastLogin = curTime;
                    userObj.failedAttempt = 0;
                }
                else {
                    userObj.failedAttempt++;
                }
                yield this._pool.query('UPDATE users SET "failedAttempt"=$1, "lastLogin"=$2 WHERE "_id"=$3', [userObj.failedAttempt, curTime, userObj._id]);
                return userObj.failedAttempt === 0 ? undefined : 'invalid credential';
            }
            catch (e) {
                return 'internal error';
            }
        });
    }
    /**
     * Handles user logout
     *
     * @param {SessionStruct} sessionStruct - A session for receiving login session data
     * @returns {Promise<string | undefined>} - Logout error (undefined if logout is successful)
     */
    logout(sessionStruct) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let sessionObj = sessionStruct.data;
                if (sessionObj) {
                    // Clears critical login data
                    delete sessionObj.userId;
                    delete sessionObj.lastLogin;
                }
            }
            catch (e) {
                return 'internal error';
            }
            return;
        });
    }
    /**
     * Generates a scrypt encrypted password
     *
     * @param {string} clrPw - Clear text password
     * @returns {string} - Scrypt encrypted password
     */
    genScryptedPass(clrPw) {
        let salt = crypto.randomBytes(16);
        return salt.toString('base64') + ':' + crypto.scryptSync(clrPw + USER_PASSWORD_SALT, salt, 64, {
            cost: 16384,
            blockSize: 8,
            parallelization: 1
        }).toString('base64');
    }
    /**
     * Update Postgre database pool
     *
     * @param {Pool} pool - Postgre pool
     */
    updateDbPool(pool) {
        this._pool = pool;
    }
}
exports.LoginController = LoginController;
