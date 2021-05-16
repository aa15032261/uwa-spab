"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const tslib_1 = require("tslib");
// import config file
require("./Config");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
class SessionController {
    /**
     * SessionController manages session token of the application
     */
    constructor() {
        let cookieIvHash = crypto.createHash('md5');
        cookieIvHash.update(SESSION_COOKIE_IV);
        this._cookieIv = cookieIvHash.digest();
        let cookieKeyHash = crypto.createHash('sha256');
        cookieKeyHash.update(SESSION_COOKIE_KEY);
        this._cookieKey = cookieKeyHash.digest();
        let dataIvHash = crypto.createHash('md5');
        dataIvHash.update(SESSION_COOKIE_IV);
        this._dataIv = dataIvHash.digest();
        let dataKeyHash = crypto.createHash('sha256');
        dataKeyHash.update(SESSION_COOKIE_KEY);
        this._dataKey = dataKeyHash.digest();
        // clean up session every 15 mins
        setInterval(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._pool) {
                    return;
                }
                yield this._pool.query(`DELETE FROM sessions WHERE "expireAt" < $1`, [(new Date()).getTime()]);
            }
            catch (e) { }
        }), 15 * 60 * 1000);
    }
    /**
     * Update Postgre database pool
     *
     * @param {Pool} pool - Postgre pool
     */
    updateDbPool(pool) {
        this._pool = pool;
    }
    /**
     * Get encryption key pair
     *
     * @param {'cookie' | 'data'} type - Key pair type
     * @returns {[Buffer, Buffer] | undefined} - An array contain key and iv buffer
     */
    _getKeyIv(type) {
        let keyIv;
        if (type === 'cookie') {
            keyIv = [this._cookieKey, this._cookieIv];
        }
        else if (type === 'data') {
            keyIv = [this._dataKey, this._dataIv];
        }
        return keyIv;
    }
    /**
     * Decrypt data
     *
     * @param {Buffer} buf - Encrypted data
     * @param {'cookie' | 'data'} type - Key pair type
     * @returns {string} - Decrypted data
     */
    _decrypt(buf, type) {
        let ret = '';
        try {
            let keyIv = this._getKeyIv(type);
            if (!keyIv) {
                throw 'invalid type';
            }
            let decipher = crypto.createDecipheriv('aes-256-cbc', ...keyIv);
            ret = Buffer.concat([decipher.update(buf), decipher.final()]).toString('utf8');
        }
        catch (e) { }
        return ret;
    }
    ;
    /**
     * Encrypt data
     *
     * @param {string} - Decrypted data
     * @param {'cookie' | 'data'} type - Key pair type
     * @returns {Buffer} - Encrypted data
     */
    _encrypt(str, type) {
        let ret = Buffer.alloc(0);
        try {
            let keyIv = this._getKeyIv(type);
            if (!keyIv) {
                throw 'invalid type';
            }
            let cipher = crypto.createCipheriv('aes-256-cbc', ...keyIv);
            ret = Buffer.concat([cipher.update(Buffer.from(str, 'utf8')), cipher.final()]);
        }
        catch (err) { }
        return ret;
    }
    ;
    /**
     * Generate an unique cookie token
     *
     * @returns {Promise<{token: string, encryptedToken: string} | undefined>} - Cookie token
     */
    _generateToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._pool) {
                return undefined;
            }
            for (let i = 0; i < 5; i++) {
                try {
                    let token = crypto.randomBytes(64).toString('hex');
                    //get user account from database
                    let res = (yield this._pool.query(`SELECT * FROM sessions WHERE "_id"=$1 AND "name"=$2`, [token, SESSION_NAME])).rows[0];
                    if (res) {
                        if (i === 4) {
                            return undefined;
                        }
                    }
                    else {
                        return {
                            token: token,
                            encryptedToken: this._encrypt(token, 'cookie').toString('hex')
                        };
                    }
                }
                catch (err) { }
            }
            return undefined;
        });
    }
    ;
    /**
     * Get decrypted cookie token
     *
     * @param {string} encryptedToken - Encrypted cookie token
     * @returns {string | undefined} - Decrypted cookie token
     */
    _getToken(encryptedToken) {
        try {
            let token = this._decrypt(Buffer.from(encryptedToken, 'hex'), 'cookie');
            if (token.length === 128) {
                return token;
            }
        }
        catch (err) {
        }
        return undefined;
    }
    ;
    /**
     * Compare the similarity of two strings
     *
     * @param {string} s1 - String 1
     * @param {string} s2 - String 2
     * @returns {number} - Similarity (0..1)
     */
    _similarity(s1, s2) {
        if (!s1 || !s2) {
            return 0;
        }
        else {
            let longer = s1;
            let shorter = s2;
            if (s1.length < s2.length) {
                longer = s2;
                shorter = s1;
            }
            let longerLength = longer.length;
            if (longerLength === 0) {
                return 1.0;
            }
            longer = longer.toLowerCase();
            shorter = shorter.toLowerCase();
            let costs = new Array();
            for (let i = 0; i <= longer.length; i++) {
                let lastValue = i;
                for (let j = 0; j <= shorter.length; j++) {
                    if (i == 0) {
                        costs[j] = j;
                    }
                    else {
                        if (j > 0) {
                            let newValue = costs[j - 1];
                            if (longer.charAt(i - 1) != shorter.charAt(j - 1)) {
                                newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                            }
                            costs[j - 1] = lastValue;
                            lastValue = newValue;
                        }
                    }
                }
                if (i > 0) {
                    costs[shorter.length] = lastValue;
                }
            }
            return (longerLength - costs[shorter.length]) / longerLength;
        }
    }
    ;
    /**
     * Append 4 bytes random number to a string
     *
     * @param {string} str - String without random number
     * @returns {string} - String with random number
     */
    _generateR(str) {
        return crypto.randomBytes(4).toString('hex') + str;
    }
    ;
    /**
     * Remove 4 bytes random number from a string
     *
     * @param {string} str - String with random number
     * @returns {string} - String without random number
     */
    _removeR(str) {
        return str.substring(8);
    }
    ;
    /**
     * Compare session information
     *
     * @param {any} info - Session info object 1
     * @param {any} info2 - Session info object 2
     * @returns {boolean} - True if the two session info objects matched, otherwise, false
     */
    _compareInfo(info, info2) {
        if (info && info2) {
            let agentSimilarity = this._similarity(info['agent'], info2['agent']);
            if (agentSimilarity > 0.9) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    ;
    /**
     * Create a new session
     *
     * @param {any} info - Session info object
     * @param {any} data - Session data object
     * @returns {Promise<string | undefined>} - Encrypted cookie token
     */
    _createSession(info, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._pool) {
                    throw 'fail';
                }
                let expire = new Date().getTime() + SESSION_TTL * 1000;
                info = this._encrypt(this._generateR(JSON.stringify(info)), 'data');
                data = this._encrypt(this._generateR(JSON.stringify(data)), 'data');
                let tokens = yield this._generateToken();
                if (!tokens) {
                    throw 'fail';
                }
                // success
                yield this._pool.query(`INSERT INTO sessions ("_id", "name", "expireAt", "info", "data") VALUES ($1, $2, $3, $4, $5)`, [tokens.token, SESSION_NAME, expire, info, data]);
                return tokens.encryptedToken;
            }
            catch (e) {
            }
            return undefined;
        });
    }
    ;
    /**
     * Delete a session by decrypted cookie token
     *
     * @param {string} token - Decrypted cookie token
     */
    _deleteSessionInternal(token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._pool) {
                    return;
                }
                yield this._pool.query(`UPDATE sessions SET "expireAt"=$1 WHERE "_id"=$2 AND "name"=$3`, [new Date().getTime() + 60 * 1000, token, SESSION_NAME]);
            }
            catch (e) { }
        });
    }
    /**
     * Delete a session by encrypted cookie token
     *
     * @param {string} encryptedToken - Encrypted cookie token
     */
    _deleteSession(encryptedToken) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = this._getToken(encryptedToken);
            if (token) {
                yield this._deleteSessionInternal(token);
            }
        });
    }
    ;
    /**
     * Get session data from database by encrypted cookie token
     *
     * @param {string} encryptedToken - Encrypted cookie token
     * @param {any} info - Session info object
     * @returns {Promise<any | undefined>} - Session data object
     */
    _getSessionData(encryptedToken, info) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._pool) {
                    return;
                }
                let token = this._getToken(encryptedToken);
                if (!token) {
                    return;
                }
                let res = (yield this._pool.query(`SELECT * FROM sessions WHERE "_id"=$1 AND "name"=$2`, [token, SESSION_NAME])).rows[0];
                if (res) {
                    let time = new Date();
                    if (res.expireAt && time.getTime() < res.expireAt) {
                        if (!res.info) {
                            throw 'sessions corrupted';
                        }
                        if (this._compareInfo(JSON.parse(this._removeR(this._decrypt(res.info, 'data'))), info) === true) {
                            if (res.data) {
                                return JSON.parse(this._removeR(this._decrypt(res.data, 'data')));
                            }
                        }
                        else {
                            //hijacked session
                            //TO DO: ip blacklist
                            throw 'hijacked session';
                        }
                    }
                    else {
                        //session expired
                        throw 'session expired 2';
                    }
                }
                else {
                    //session expired
                    throw 'session expired 1';
                }
            }
            catch (err) {
            }
            return;
        });
    }
    ;
    /**
     * Get session info object from http headers and ip address
     *
     * @param {IncomingHttpHeaders} headers - Http headers
     * @param {string | undefined} ip - Ip address of the connection
     * @returns {any} - Session info object
     */
    _getInfoFromConnection(headers, ip) {
        let self = this;
        let ipAddress = '';
        // get client's ip through cloudflare
        if (headers['cf-connecting-ip'] !== undefined) {
            ipAddress = headers['cf-connecting-ip'];
        }
        // get client's ip through web server
        else {
            ipAddress = (headers['x-forwarded-for'] || ip || '').split(',')[0].trim();
        }
        // get browser string
        let agent = 'Unknown';
        if (headers['user-agent']) {
            agent = headers['user-agent'].substring(0, 64) + headers['user-agent'].replace(/[^0-9]/g, '');
            agent = agent.substring(0, 512);
        }
        // convert 6to4 to ip4
        if (ipAddress.startsWith('::ffff:')) {
            ipAddress = ipAddress.substring(7);
        }
        // convert local ip4 address to ip6
        if (ipAddress === '127.0.0.1') {
            ipAddress = '::1';
        }
        return {
            'ip': ipAddress,
            'agent': agent
        };
    }
    ;
    /**
     * Get SessionStruct object from encrypted cookie token, http headers and ip address
     *
     * @param {string | undefined} encryptedToken - Encrypted cookie token
     * @param {IncomingHttpHeaders} headers - Http headers
     * @param {string | undefined} ip - Ip address of the connection
     * @returns {Promise<SessionStruct>} - SessionStruct object
     */
    getSessionStruct(encryptedToken, headers, ip) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let sessionStruct = {
                autoGen: true,
                isSaved: false,
                info: this._getInfoFromConnection(headers, ip)
            };
            if (encryptedToken) {
                let data = yield this._getSessionData(encryptedToken, sessionStruct.info);
                sessionStruct.data = data;
            }
            return sessionStruct;
        });
    }
    /**
     * Create or remove cookie of a response
     *
     * @param {express.Response} res - Express response
     * @param {string} newEncryptedToken - Unique cookie token
     * @param {boolean} isSet - Set to true to create a new session; set to false to remove existing session
     */
    _createCookie(res, newEncryptedToken, isSet) {
        try {
            let expireDate = new Date(0);
            if (isSet) {
                expireDate = new Date(Date.now() + (SESSION_TTL * 1000));
            }
            if (res.headersSent === false) {
                let cookieObj = {
                    domain: DOMAIN,
                    secure: true,
                    httpOnly: true,
                    sameSite: true,
                    expires: expireDate
                };
                res.cookie(SESSION_NAME, newEncryptedToken, cookieObj);
            }
        }
        catch (e) {
        }
    }
    ;
    /**
     * Remove cookie of a response
     *
     * @param {express.Response} res - Express response
     */
    destroyClientCookie(res) {
        try {
            if (res.headersSent === false) {
                res.cookie(SESSION_NAME, '', {
                    domain: DOMAIN,
                    secure: true,
                    httpOnly: true,
                    sameSite: true,
                    expires: new Date(0)
                });
            }
        }
        catch (e) {
        }
    }
    /**
     * Get session middleware for express
     *
     * @returns - Session middleware for express
     */
    getSessionHandler() {
        return [
            cookieParser(),
            (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                // save session based on session parameters
                let saveSession = (req, res, callback, args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    // invoke original send function
                    let final = function () {
                        if (callback) {
                            if (args) {
                                callback.apply(res, args);
                            }
                            else {
                                callback.apply(res);
                            }
                        }
                    };
                    let sessionStruct = req.session[SESSION_NAME];
                    if (!sessionStruct.isSaved) {
                        sessionStruct.isSaved = true;
                        // if the session needs to be renewed and session data is not empty
                        if (req.session[SESSION_NAME].autoGen && sessionStruct.data) {
                            // delete existing session from database
                            yield this._deleteSession(req.cookies[SESSION_NAME]);
                            // create a new session
                            let encryptedToken = yield this._createSession(sessionStruct.info, sessionStruct.data);
                            if (encryptedToken) {
                                this._createCookie(res, encryptedToken, true);
                            }
                            final();
                        }
                        else {
                            this._createCookie(res, '', false);
                            final();
                        }
                    }
                    else {
                        final();
                    }
                });
                // express response hooks
                // 
                // send(), sendFile() and sendStatus() functions are overwritten to ensure 
                // the cookie header is set correctly
                let oldSend = res.send;
                let oldSendFile = res.sendFile;
                let oldSendStatus = res.sendStatus;
                res.send = function () {
                    saveSession(req, res, oldSend, arguments);
                };
                res.sendFile = function () {
                    saveSession(req, res, oldSendFile, arguments);
                };
                res.sendStatus = function () {
                    saveSession(req, res, oldSendStatus, arguments);
                };
                // create a empty session object
                if (!req.session) {
                    req.session = {};
                }
                // get session data from database
                try {
                    req.session[SESSION_NAME] = yield this.getSessionStruct(req.cookies[SESSION_NAME], req.headers, req.socket.remoteAddress);
                    next();
                }
                catch (err) {
                    next();
                }
            })
        ];
    }
    ;
}
exports.SessionController = SessionController;
