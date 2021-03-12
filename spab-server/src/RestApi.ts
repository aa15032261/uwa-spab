import * as path from 'path';

import * as express from 'express';
import * as fs from 'fs-extra';

import { LoginController, LoginStatus } from './LoginController';


import { Validator } from 'jsonschema';
import { SessionController, SessionStruct } from './SessionController';
import { Pool } from 'pg';

export class RestApi {

    private _pool?: Pool;

    constructor(
        app: express.Express,
        sessionController: SessionController,
        loginController: LoginController
    ) {
        let sessionHandler = sessionController.getSessionHandler();
        let loginHandler = loginController.getLoginHandler();

        app.get(
            [BASE_URL, BASE_URL + '/', BASE_URL + '/index.html.var', BASE_URL + '/s'],
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

        // spab-server static files
        app.use(BASE_URL + '/static', express.static(path.resolve(__dirname, './../static')));


        // spab-gui files
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
            spabGuiRoute
        );
        app.use(BASE_URL + '/spab_gui', spabGuiRouter);


        app.post(
            BASE_URL + '/api/login',
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
            BASE_URL + '/api/logout',
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

                await loginController.logout(
                    sessionStruct
                );

                sessionController.destroyClientCookie(res);

                res.send({
                    success: true
                });
            }
        );

        app.get(
            BASE_URL + '/api/heartbeat',
            express.json(),
            sessionHandler,
            async (
                req: express.Request, 
                res: express.Response
            ) => {
                res.status(200).send();
            }
        );

        app.use((
            err: any, 
            req: express.Request, 
            res: express.Response,
            next: express.NextFunction
        ) => {
            if (err) {
              res.status(500).send();
              return;
            }
            next();
        });
    }

    public updateDbPool(pool: Pool) {
        this._pool = pool;
    }
}