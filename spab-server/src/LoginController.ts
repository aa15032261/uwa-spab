// import config file
import './Config';

import * as mongodb from 'mongodb'
import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { SessionStruct } from 'SessionController';

interface LoginSession {
    lastLogin: number,
    userId: string
}

interface LoginStatus {
    loginStatus: {
        loggedIn: boolean,
        lastLogin: number,
        userId: string
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

            spabReq.loginStatus = {
                loggedIn: false,
                lastLogin: 0,
                userId: ''
            }

            try {
                if (!this._db) {
                    throw 'db not ready';
                }

                if (req.session && (req.session as any)[SESSION_NAME]) {

                    let sessionStruct = (req.session as any)[SESSION_NAME] as SessionStruct;

                    if (!sessionStruct.data) {
                        throw 'not found';
                    }

                    let sessionObj = sessionStruct.data as LoginSession;
            
                    if (sessionObj.userId) {
                        let userObj = await this._db.collection('user').findOne({
                            _id: new mongodb.ObjectId(sessionObj.userId)
                        });

                        if (!userObj) {
                            throw 'not found';
                        }

                        if (sessionObj.lastLogin < userObj.lastModified) {
                            throw 'expired';
                        }

                        spabReq.loginStatus.loggedIn = true;
                        spabReq.loginStatus.userId = sessionObj.userId;
                        spabReq.loginStatus.lastLogin = sessionObj.lastLogin;
                    }
                }
            } catch (e) { }

            next();
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
            console.log(e);
            return 'internal error';
        }
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

