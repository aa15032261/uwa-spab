// import config file
import './Config';

import * as express from 'express';
import * as crypto from 'crypto';
import { SessionStruct } from 'SessionController';
import { Pool } from 'pg';

interface LoginSession {
    lastLogin?: number,
    userId?: string
}

interface LoginStatus {
    loginStatus?: {
        loggedIn: boolean,
        lastLogin: number,
        userId: string,
        reason? : string
    }
}

class LoginController {

    private _pool?: Pool;

    constructor() {}

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

    public async getLoginStatus(
        obj: LoginStatus, 
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



    public _verifyUserPass(clrPw: string, scryptedPw: string) {
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
    
            if (userObj.failedAttempt > 5) {
                return 'account disabled';
            }
    
            if (this._verifyUserPass(clrPw, userObj.pass)) {
                if (!sessionStruct.data) {
                    sessionStruct.data = {};
                }

                let sessionObj = sessionStruct.data as LoginSession;
                sessionObj.userId = userObj._id;
                sessionObj.lastLogin = (new Date()).getTime();
                userObj.failedAttempt = 0;
            } else {
                userObj.failedAttempt++;
            }

            await this._pool.query(
                'UPDATE users SET "failedAttempt"=$1 WHERE "_id"=$2',
                [userObj.failedAttempt, userObj._id]
            );

            return userObj.failedAttempt === 0 ? undefined : 'invalid credential';

        } catch (e) {
            return 'internal error';
        }
    }

    public async logout(sessionStruct: SessionStruct): Promise<string | undefined> {
        try {
            let sessionObj = sessionStruct.data as LoginSession;

            if (sessionObj) {
                delete sessionObj.userId;
                delete sessionObj.lastLogin;
            }
            
        } catch (e) {
            return 'internal error';
        }

        return;
    }

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

    public updateDbPool(pool: Pool) {
        this._pool = pool;
    }
}

export {
    LoginStatus,
    LoginSession,
    LoginController
}

