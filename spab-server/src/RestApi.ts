import * as path from 'path';

import * as express from 'express';
import * as fs from 'fs-extra';

import { LoginController, LoginStatus } from './LoginController';


import { Validator } from 'jsonschema';
import { SessionController, SessionStruct } from './SessionController';

export class RestApi {

    /**
     * RestApi handles REST APIs
     * 
     * @param {express.Express} app
     * @param {SessionController} sessionController 
     * @param {LoginController} loginController 
     */
    constructor(
        app: express.Express,
        sessionController: SessionController,
        loginController: LoginController
    ) {
        let sessionHandler = sessionController.getSessionHandler();
        let loginHandler = loginController.getLoginHandler();

        // Redirects index page based on login status
        app.get(
            [BASE_URL, BASE_URL + '/', BASE_URL + '/index.html.var'],
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

        // spab-server static files (mainly for the login page)
        app.use(BASE_URL + '/static', express.static(path.resolve(__dirname, './../static')));


        // spab-gui files route
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
                // Only authenticated users can access app files
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


        // handle login request
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
                // Validates api parameters
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
                // If the user is already logged in, returns successful
                if ((req as any as LoginStatus).loginStatus?.loggedIn) {
                    // logged in
                    res.send({
                        success: true
                    });
                    return;
                }

                // Otherwise, verifies user credentials
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
                // If the session doesnt exist, returns successful
                if (!req.session || !(req.session as any)[SESSION_NAME]) {
                    res.send({
                        success: true
                    });
                    return;
                }

                // Otherwise, destroys session then returns successful
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

        // Heartbeat API is used for checking current login status
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

        // Catches all errors and returns error 500 to the user
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
}