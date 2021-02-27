import * as path from 'path';

import * as express from 'express';
import * as mongodb from 'mongodb'

import { LoginController, LoginSession, LoginStatus } from './LoginController';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";

import { Validator } from 'jsonschema';
import { SessionController, SessionStruct } from './SessionController';

export class RestApi {

    private _db?: mongodb.Db;

    constructor(
        app: express.Express,
        sessionController: SessionController,
        loginController: LoginController
    ) {
        let sessionHandler = sessionController.getSessionHandler();
        let loginHandler = loginController.getLoginHandler();

        app.get(
            '/',
            sessionHandler,
            loginHandler,
            (
                req: express.Request, 
                res: express.Response
            ) => {
                if ((req as any as LoginStatus).loginStatus?.loggedIn) {
                    // logged in
                    res.send();

                } else {
                    // logged out
                    res.sendFile(path.resolve(__dirname, '../private/login.html'));
                }
            }
        )

        app.post(
            '/api/login',
            express.json(),
            sessionHandler,
            loginHandler,
            (
                req: express.Request, 
                res: express.Response,
                next: express.NextFunction
            ) => {
                
                let valRes = (new Validator()).validate(
                    req.body,
                    {
                        type: 'object',
                        properties: {
                            'email': {type: 'string', format: 'email'},
                            'pass': {type: 'string', minLength: 8}
                        },
                        required: ['email', 'pass']
                    }
                )
                
                if (valRes.errors.length === 0) {
                    next();
                } else {
                    res.send({
                        success: false,
                        reason: 'invalid request'
                    });
                }
            },
            async (
                req: express.Request, 
                res: express.Response
            ) => {
                if ((req as any as LoginStatus).loginStatus?.loggedIn) {
                    // logged in
                    res.send({
                        success: true
                    });
                    return;
                }

                let sessionStruct = (req.session as any)[SESSION_NAME] as SessionStruct;

                // logged out
                let loginRes = await loginController.login(
                    req.body.email,
                    req.body.pass,
                    sessionStruct
                );

                if (loginRes) {
                    res.send({
                        success: false,
                        reason: loginRes
                    });
                    return;
                }

                res.send({
                    success: true
                });
            }
        )
    }

    public updateDbPool(db: mongodb.Db) {
        this._db = db;
    }
}