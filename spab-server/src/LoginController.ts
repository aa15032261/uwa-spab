// import config file
import './Config';

import * as express from 'express';
import * as crypto from 'crypto';
import { SessionStruct } from 'SessionController';
import { Pool } from 'pg';

interface LoginSession {
    /** last login timestamp */
    lastLogin?: number,
    userId?: string
}

interface LoginStatus {
    loginStatus?: {
        /** current login status */
        loggedIn: boolean,
        /** last login timestamp */
        lastLogin: number,
        userId: string,
        /** login error */
        reason? : string
    }
}

class LoginController {

    /** postgres connection pool */
    private _pool?: Pool;

    /**
     * LoginController manages login sessions of the application
     */
    constructor() {}

    /**
     * Get login middleware for express
     * 
     * @returns - Login middleware for express
     */
    public getLoginHandler() {
        return async (
            req: express.Request, 
            res: express.Response, 
            next: express.NextFunction
        ) => {
            let spabReq = req as express.Request & LoginStatus;
            let sessionStruct: SessionStruct | undefined;

            if (req.session && (req.session as any)[SESSION_NAME]) {
                sessionStruct = (req.session as any)[SESSION_NAME] as SessionStruct;
            }

            await this.getLoginStatus(spabReq, sessionStruct);

            next();
        }
    }

    /**
     * Get login status of a session. The status is attached to obj.
     * 
     * @param {any & LoginStatus} obj - Object for receiving login status
     * @param {SessionStruct | undefined} sessionStruct - The login session
     */
    public async getLoginStatus(
        obj: any & LoginStatus, 
        sessionStruct: SessionStruct | undefined
    ) {
        obj.loginStatus = {
            loggedIn: false,
            lastLogin: 0,
            userId: '',
            reason: 'unknown'
        }

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

            let sessionObj = sessionStruct.data as LoginSession;

            if (!sessionObj.userId) {
                throw 'invalid session';
            }

            let userObj = (await this._pool.query(
                'SELECT * FROM users WHERE _id = $1', 
                [sessionObj.userId]
            )).rows[0];

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
        } catch (e) {
            obj.loginStatus.reason = e.toString();
        }
    }


    /**
     * Verifies user password using scrypt
     * 
     * @param {string} clrPw - Clear text password
     * @param {string} scryptedPw - Scrypt encrypted password
     * @returns {boolean} - True if the password is valid, otherwise, false
     */
    private _verifyUserPass(clrPw: string, scryptedPw: string) {
        try {
            let [saltHex, pwHex] = scryptedPw.split(":");

            let salt = Buffer.from(saltHex, 'base64');
    
            let pw = crypto.scryptSync(
                clrPw + USER_PASSWORD_SALT,
                salt, 
                64,
                {
                    cost: 16384,
                    blockSize: 8,
                    parallelization: 1
                }
            ).toString('base64');
    
            return pwHex === pw;
        } catch (e) {

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
    public async login(email: string, clrPw: string, sessionStruct: SessionStruct): Promise<string | undefined> {
        try {
            if (!this._pool) {
                throw 'internal error';
            }

            let userObj = (await this._pool.query(
                'SELECT * FROM users WHERE email = $1', 
                [email]
            )).rows[0];
    
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

                let sessionObj = sessionStruct.data as LoginSession;
                sessionObj.userId = userObj._id;
                sessionObj.lastLogin = curTime;
                userObj.failedAttempt = 0;
            } else {
                userObj.failedAttempt++;
            }

            await this._pool.query(
                'UPDATE users SET "failedAttempt"=$1, "lastLogin"=$2 WHERE "_id"=$3',
                [userObj.failedAttempt, curTime, userObj._id]
            );

            return userObj.failedAttempt === 0 ? undefined : 'invalid credential';

        } catch (e) {
            return 'internal error';
        }
    }

    /**
     * Handles user logout
     * 
     * @param {SessionStruct} sessionStruct - A session for receiving login session data
     * @returns {Promise<string | undefined>} - Logout error (undefined if logout is successful)
     */
    public async logout(sessionStruct: SessionStruct): Promise<string | undefined> {
        try {
            let sessionObj = sessionStruct.data as LoginSession;

            if (sessionObj) {
                // Clears critical login data
                delete sessionObj.userId;
                delete sessionObj.lastLogin;
            }
        } catch (e) {
            return 'internal error';
        }

        return;
    }

    /**
     * Generates a scrypt encrypted password
     * 
     * @param {string} clrPw - Clear text password
     * @returns {string} - Scrypt encrypted password
     */
    public genScryptedPass(clrPw: string) {
        let salt = crypto.randomBytes(16);

        return salt.toString('base64') + ':' + crypto.scryptSync(
            clrPw + USER_PASSWORD_SALT,
            salt, 
            64,
            {
                cost: 16384,
                blockSize: 8,
                parallelization: 1
            }
        ).toString('base64');
    }

    /**
     * Update Postgre database pool
     * 
     * @param {Pool} pool - Postgre pool
     */
    public updateDbPool(pool: Pool) {
        this._pool = pool;
    }
}

export {
    LoginStatus,
    LoginSession,
    LoginController
}
