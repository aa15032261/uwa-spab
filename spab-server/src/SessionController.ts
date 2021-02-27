// import config file
import './Config';

import * as cookieParser from 'cookie-parser';
import * as crypto from 'crypto';
import * as mongodb from 'mongodb';
import * as express from 'express';

interface SessionStruct {
    autoGen: boolean,
    isSet: boolean,
    info: any,
    data?: any
}

class SessionController {

    private _db?: mongodb.Db;
    private _collectionName: string = 'session';

    constructor () {}

    private _setupAutoCleanup() {
        let self = this;

        if (!this._db) {
            return;
        }

        this._db.collection(this._collectionName).dropIndex('expire_' + SESSION_NAME).catch((err) => { });

        this._db.collection(this._collectionName).createIndex({ 'expireAt': 1 }, { 
            name: 'expire_' + SESSION_NAME, 
            expireAfterSeconds: 0, 
            partialFilterExpression: {
                name: SESSION_NAME
            }
        }).catch((err) => {
            setTimeout(() => {
                this._setupAutoCleanup();
            }, 60000);
        });
    }

    public updateDbPool(db: mongodb.Db) {
        this._db = db;
        this._setupAutoCleanup();
    }




    private _decrypt(buf: Buffer): string {
        let ret = '';
        try {
            let decipher = crypto.createDecipheriv(
                'aes-256-cbc', 
                Buffer.from([0x11, 0xF7, 0xA3, 0xFD, 0xF6, 0x83, 0x3E, 0xEA, 0x3D, 0x3B, 0xE7, 0x3D, 0xF0, 0x2F, 0x6E, 0x62, 0x6E, 0x97, 0x89, 0xA2, 0x7E, 0x63, 0xE4, 0x03, 0x1F, 0xDC, 0x9B, 0x64, 0xB9, 0x38, 0x36, 0x0C]), 
                Buffer.from([0xEF, 0x98, 0x5F, 0x38, 0x45, 0x8E, 0xA3, 0xF7, 0x51, 0xB2, 0x41, 0xDF, 0xC0, 0x8B, 0x5F, 0x81])
            );
    
            ret = Buffer.concat([decipher.update(buf), decipher.final()]).toString('utf8');
        } catch (e) { }
    
        return ret;
    };

    private _encrypt(str: string): Buffer {
        let ret = Buffer.alloc(0);

        try {
            let cipher = crypto.createCipheriv(
                'aes-256-cbc', 
                Buffer.from([0x11, 0xF7, 0xA3, 0xFD, 0xF6, 0x83, 0x3E, 0xEA, 0x3D, 0x3B, 0xE7, 0x3D, 0xF0, 0x2F, 0x6E, 0x62, 0x6E, 0x97, 0x89, 0xA2, 0x7E, 0x63, 0xE4, 0x03, 0x1F, 0xDC, 0x9B, 0x64, 0xB9, 0x38, 0x36, 0x0C]), 
                Buffer.from([0xEF, 0x98, 0x5F, 0x38, 0x45, 0x8E, 0xA3, 0xF7, 0x51, 0xB2, 0x41, 0xDF, 0xC0, 0x8B, 0x5F, 0x81])
            );
    
            ret = Buffer.concat([cipher.update(Buffer.from(str, 'utf8')), cipher.final()]);
        } catch (err) { }

        return ret;
    };
    



    private async _generateToken(): Promise<{token: string, encryptedToken: string} | undefined> {
        if (!this._db) {
            return undefined;
        }

        for (let i = 0; i < 5; i++) {
            try {
                let token = crypto.randomBytes(64).toString('hex');

                //get user account from database
                let res = await this._db.collection(this._collectionName).findOne({ _id: token, name: SESSION_NAME});

                if (res) {
                    if (i === 4) {
                        return undefined;
                    }
                } else {
                    return {
                        token: token,
                        encryptedToken: this._encrypt(token).toString('hex')
                    }
                }
            } catch (err) { }
        }

        return undefined;
    };

    private _getToken(encryptedToken: string): string | undefined {
        try {
            let token = this._decrypt(Buffer.from(encryptedToken, 'hex'));
            if (token.length === 128) {
                return token;
            }
        } catch (err) {

        }

        return undefined;
    };
    
    private _similarity(s1: string, s2: string): number {
        if (!s1 || !s2) {
            return 0;
        } else {
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
                    } else {
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
    };
    
    private _generateR(str: string) {
        return crypto.randomBytes(4).toString('hex') + str;
    };
    private _removeR(str: string) {
        return str.substring(8);
    };
    
    private _verifyInfo(info: any, info2: any) {
        if (info && info2) {
            let agentSimilarity = this._similarity(info['agent'], info2['agent']);
    
            if (agentSimilarity > 0.9) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    
    private async _createSession(
        info: any, 
        data: any
    ): Promise<string | undefined> {
        try {
            if (!this._db) {
                throw 'fail';
            }
    
            let expire = new Date(new Date().getTime() + SESSION_TTL * 1000);
            info = this._encrypt(this._generateR(JSON.stringify(info)));
            data = this._encrypt(this._generateR(JSON.stringify(data)));

            let tokens = await this._generateToken();

            if (!tokens) {
                throw 'fail';
            }
                
            // success
            await this._db!.collection(this._collectionName).insertOne({
                _id: tokens.token,
                name: SESSION_NAME,
                expireAt: expire,
                info: info,
                data: data
            });
            
            return tokens.encryptedToken;
        } catch (e) {

        }

        return undefined;
    };

    private async _deleteSessionInternal(token: string) {
        try {
            if (!this._db) {
                return;
            }

            await this._db.collection(this._collectionName).updateOne(
                {_id: token, name: SESSION_NAME}, 
                {$set: {expireAt: new Date(new Date().getTime() + 60 * 1000)}}
            );

        } catch (e) { }
    }

    private async _deleteSession(encryptedToken: string) {
        let token = this._getToken(encryptedToken);

        if (token) {
            await this._deleteSessionInternal(token);
        }
    };


    private async _getSessionData(encryptedToken: string, info: any): Promise<any | undefined> {
        try {
            if (!this._db) {
                return;
            }

            let token = this._getToken(encryptedToken);

            if (!token) {
                return;
            }

            let res = await this._db.collection(this._collectionName).findOne({ _id: token, name: SESSION_NAME });

            if (res) {
                let time = new Date();
                let expire = res.expireAt;

                if (expire instanceof Date && time.getTime() < expire.getTime()) {
                    if (!res.info) {
                        throw 'session corrupted';
                    }

                    if (this._verifyInfo(JSON.parse(this._removeR(this._decrypt(res.info.buffer))), info) === true) {
                        if (res.data) {
                            return JSON.parse(this._removeR(this._decrypt(res.data.buffer)));
                        }
                    } else {
                        //hijacked session
                        //TO DO: ip blacklist
                        throw 'hijacked session';
                    }
                } else {
                    //session expired
                    throw 'session expired 2';
                }
            } else {
                //session expired
                throw 'session expired 1';
            }
        } catch (err) {

        }
        return;
    };

    
    private _getInfoFromExpress(req: express.Request) {
        let self = this;

        let ipAddress: string = '';

        // get client's ip through cloudflare
        if (req.headers['cf-connecting-ip'] !== undefined) {
            ipAddress = req.headers['cf-connecting-ip'] as string;
        }
        // get client's ip through nginx
        else {
            ipAddress = ((req.headers['x-forwarded-for'] || req.connection.remoteAddress || '') as string).split(',')[0].trim();
        }

        let agent = 'Unknown';
        if (req.headers['user-agent']) {
            agent = req.headers['user-agent'].substring(0, 64) + req.headers['user-agent'].replace(/[^0-9]/g, '');
            agent = agent.substring(0, 512);
        }

        if (ipAddress.startsWith('::ffff:')) {
            ipAddress = ipAddress.substring(7);
        }
        if (ipAddress === '127.0.0.1') {
            ipAddress = '::1';
        }

        return {
            'ip': ipAddress,
            'agent': agent
        };
    };

    


    private _createCookie(
        res: express.Response, 
        newEncryptedToken: string, 
        isSet: boolean
    ) {
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
        } catch (e) {

        }
    };

    private _destroyClientCookie(
        res: express.Response, 
    ) {
        try {
            if (res.headersSent === false) {
                res.cookie(
                    SESSION_NAME, 
                    '', 
                    {
                        domain: DOMAIN,
                        secure: true,
                        httpOnly: true,
                        sameSite: true,
                        expires: new Date(0)
                    }
                );
            }
        } catch (e) {

        }
    }


    public getSessionHandler() {
        return [
            cookieParser(),
            async (req: express.Request, res: express.Response, next: express.NextFunction) => {

                let generateSession = async (req: express.Request, res: express.Response, callback: Function, args?: IArguments) => {
                    let final = function () {
                        if (callback) {
                            if (args) {
                                callback.apply(res, args);
                            } else {
                                callback.apply(res);
                            }
                        }
                    }

                    let sessionStruct = (req as any).session[SESSION_NAME] as SessionStruct;
    
                    if (!sessionStruct.isSet) {
                        sessionStruct.isSet = true;
                        if ((req as any).session[SESSION_NAME].autoGen && sessionStruct.data) {

                            await this._deleteSession(req.cookies[SESSION_NAME]);

                            let encryptedToken = await this._createSession(
                                sessionStruct.info, 
                                sessionStruct.data
                            );

                            if (encryptedToken){
                                this._createCookie(res, encryptedToken, true);
                            }
                            final();
                        } else {
                            this._createCookie(res, '', false);
                            final();
                        }
                    } else {
                        final();
                    }
                };
    
                let oldSend = res.send;
                let oldSendFile = res.sendFile;
                let oldSendStatus = res.sendStatus;
    
                (res as any).send = function () {
                    generateSession(req, res, oldSend, arguments);
                };

                (res as any).sendFile = function () {
                    generateSession(req, res, oldSendFile, arguments);
                };

                (res as any).sendStatus = function () {
                    generateSession(req, res, oldSendStatus, arguments);
                };
    
                if (!req.session) {
                    (req as any).session = { };
                }
                try {
                    let sessionStruct: SessionStruct = {
                        autoGen: true,
                        isSet: false,
                        info: this._getInfoFromExpress(req)
                    };

                    (req as any).session[SESSION_NAME] = sessionStruct;

                    if (req.cookies[SESSION_NAME]) {
                        let data = await this._getSessionData(req.cookies[SESSION_NAME], sessionStruct.info);
                        sessionStruct.data = data;
                    }

                    next();
                } catch (err) {
                    next();
                }
            }
        ]
    };
}


export {
    SessionStruct,
    SessionController
}