// import config file
import './Config';

import * as mongodb from 'mongodb'
import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { SessionStruct } from 'SessionController';

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

    private _db?: mongodb.Db;

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
            if (!this._db) {
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

            let userObj = await this._db.collection('user').findOne({
                _id: new mongodb.ObjectId(sessionObj.userId)
            });

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



    private async _verifyUserPass(clrPw: string, bcryptedPw: string) {
        return await bcrypt.compare(
            clrPw + USER_PASSWORD_SALT,
            bcryptedPw
        );
    }

    public async login(email: string, clrPw: string, sessionStruct: SessionStruct): Promise<string | undefined> {
        try {
            if (!this._db) {
                throw 'internal error';
            }
    
            let userObj = await this._db.collection('user').findOne({
                email: email
            });
    
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
                sessionObj.userId = userObj._id.toString();
                sessionObj.lastLogin = (new Date()).getTime();
                userObj.failedAttempt = 0;
            } else {
                userObj.failedAttempt++;
            }
    
            await this._db.collection('user').updateOne({
                _id: userObj._id
            }, {
                $set: {
                    failedAttempt: userObj.failedAttempt
                }
            });
    
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

    public async genBcryptedPass(clrPw: string) {
        return await bcrypt.hash(clrPw + USER_PASSWORD_SALT, 12)
    }

    public updateDbPool(db: mongodb.Db) {
        this._db = db;
    }
}

export {
    LoginStatus,
    LoginSession,
    LoginController
}

