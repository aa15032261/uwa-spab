import * as path from 'path';

import * as express from 'express';
import * as mongodb from 'mongodb';
import * as fs from 'fs-extra';

import { LoginController, LoginSession, LoginStatus } from './LoginController';


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
                    res.send(fs.readFileSync(path.resolve(__dirname, './../../spab-gui/dist/index.html'), 'utf8'));
                } else {
                    // logged out
                    res.send(fs.readFileSync(path.resolve(__dirname, '../private/login.html'), 'utf8'));
                }
            }
        )


        let spabGuiRouter = express.Router();
        let spabGuiRoute = express.static(path.resolve(__dirname, './../../spab-gui/dist'));
        spabGuiRouter.get(
            '*.js',
            sessionHandler,
            loginHandler,
            (
                req: express.Request, 
                res: express.Response,
                next: express.NextFunction
            ) => {
                if ((req as any as LoginStatus).loginStatus?.loggedIn) { 
                    next();
                    return;
                }
                res.status(403).send();
            },
            spabGuiRoute
        );
        spabGuiRouter.get(
            '*',
            async (req, res) => {
                res.status(404).send();   
            }
        );
        app.use('/spab_gui', spabGuiRouter);


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
        );


        app.post(
            '/api/logout',
            express.json(),
            sessionHandler,
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

                let logoutRes = await loginController.logout(
                    sessionStruct
                );

                if (logoutRes) {
                    res.send({
                        success: false,
                        reason: logoutRes
                    });
                    return;
                }

                res.send({
                    success: true
                });
            }
        );


        app.use((
            err: any, 
            req: express.Request, 
            res: express.Response,
            next: express.NextFunction
        ) => {
            if (err) {
                console.log(err);
              res.status(500).send();
              return;
            }
            next();
        });
    }

    public updateDbPool(db: mongodb.Db) {
        this._db = db;
    }
}