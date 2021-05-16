"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestApi = void 0;
const tslib_1 = require("tslib");
const path = require("path");
const express = require("express");
const fs = require("fs-extra");
const jsonschema_1 = require("jsonschema");
class RestApi {
    /**
     * RestApi handles REST APIs
     *
     * @param {express.Express} app
     * @param {SessionController} sessionController
     * @param {LoginController} loginController
     */
    constructor(app, sessionController, loginController) {
        let sessionHandler = sessionController.getSessionHandler();
        let loginHandler = loginController.getLoginHandler();
        // Redirects index page based on login status
        app.get([BASE_URL, BASE_URL + '/', BASE_URL + '/index.html.var'], sessionHandler, loginHandler, (req, res) => {
            var _a;
            if ((_a = req.loginStatus) === null || _a === void 0 ? void 0 : _a.loggedIn) {
                // logged in
                res.send(fs.readFileSync(path.resolve(__dirname, './../../spab-gui/dist/index.html'), 'utf8'));
            }
            else {
                // logged out
                res.send(fs.readFileSync(path.resolve(__dirname, '../private/login.html'), 'utf8'));
            }
        });
        // spab-server static files (mainly for the login page)
        app.use(BASE_URL + '/static', express.static(path.resolve(__dirname, './../static')));
        // spab-gui files route
        let spabGuiRouter = express.Router();
        let spabGuiRoute = express.static(path.resolve(__dirname, './../../spab-gui/dist'));
        spabGuiRouter.get('*.js', sessionHandler, loginHandler, (req, res, next) => {
            var _a;
            // Only authenticated users can access app files
            if ((_a = req.loginStatus) === null || _a === void 0 ? void 0 : _a.loggedIn) {
                next();
                return;
            }
            res.status(403).send();
        }, spabGuiRoute);
        spabGuiRouter.get('*', spabGuiRoute);
        app.use(BASE_URL + '/spab_gui', spabGuiRouter);
        // handle login request
        app.post(BASE_URL + '/api/login', express.json(), sessionHandler, loginHandler, (req, res, next) => {
            // Validates api parameters
            let valRes = (new jsonschema_1.Validator()).validate(req.body, {
                type: 'object',
                properties: {
                    'email': { type: 'string', format: 'email' },
                    'pass': { type: 'string', minLength: 8 }
                },
                required: ['email', 'pass']
            });
            if (valRes.errors.length === 0) {
                next();
            }
            else {
                res.send({
                    success: false,
                    reason: 'invalid request'
                });
            }
        }, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            // If the user is already logged in, returns successful
            if ((_a = req.loginStatus) === null || _a === void 0 ? void 0 : _a.loggedIn) {
                // logged in
                res.send({
                    success: true
                });
                return;
            }
            // Otherwise, verifies user credentials
            let sessionStruct = req.session[SESSION_NAME];
            let loginRes = yield loginController.login(req.body.email, req.body.pass, sessionStruct);
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
        }));
        app.post(BASE_URL + '/api/logout', express.json(), sessionHandler, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // If the session doesnt exist, returns successful
            if (!req.session || !req.session[SESSION_NAME]) {
                res.send({
                    success: true
                });
                return;
            }
            // Otherwise, destroys session then returns successful
            let sessionStruct = req.session[SESSION_NAME];
            yield loginController.logout(sessionStruct);
            sessionController.destroyClientCookie(res);
            res.send({
                success: true
            });
        }));
        // Heartbeat API is used for checking current login status
        app.get(BASE_URL + '/api/heartbeat', express.json(), sessionHandler, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            res.status(200).send();
        }));
        // Catches all errors and returns error 500 to the user
        app.use((err, req, res, next) => {
            if (err) {
                res.status(500).send();
                return;
            }
            next();
        });
    }
}
exports.RestApi = RestApi;
