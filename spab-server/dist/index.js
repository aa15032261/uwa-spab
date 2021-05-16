"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import config file
require("./Config");
const process = require("process");
const path = require("path");
const http = require("http");
const express = require("express");
const fs = require("fs-extra");
const SessionController_1 = require("./SessionController");
const LoginController_1 = require("./LoginController");
const WebSocketApi_1 = require("./WebSocketApi");
const RestApi_1 = require("./RestApi");
const pg_1 = require("pg");
main();
/**
 * spab-server app entry point
 */
function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const app = express();
            const httpServer = http.createServer(app);
            // Creates a Postgres connection pool
            const pool = new pg_1.Pool({
                host: DB_HOST,
                port: DB_PORT,
                database: DB_NAME,
                user: DB_USER,
                password: DB_PASSWORD,
            });
            // Initialises main components
            let sessionController = new SessionController_1.SessionController();
            let loginController = new LoginController_1.LoginController();
            let restApi = new RestApi_1.RestApi(app, sessionController, loginController);
            let websocketApi = new WebSocketApi_1.WebSocketApi(httpServer, sessionController, loginController);
            // Updates Postgres pool of all components
            sessionController.updateDbPool(pool);
            loginController.updateDbPool(pool);
            websocketApi.updateDbPool(pool);
            httpServer.on('error', (err) => {
                console.log(err);
                process.exit();
            });
            // If the web server is created successfully
            httpServer.listen(PORT, () => {
                // Saves current process id to a file
                let pidPath = path.resolve(__dirname, '../spab_run.pid');
                fs.writeFileSync(pidPath, process.pid.toString());
                // Removes process id if the app is crashed
                ['exit', 'uncaughtException'].forEach((eventType) => {
                    process.on(eventType, (e) => {
                        try {
                            fs.removeSync(pidPath);
                        }
                        catch (e) { }
                        console.log(e);
                        if (eventType !== 'exit') {
                            process.exit();
                        }
                    });
                });
                // Removes process id if the app is interupted
                let signals = ['SIGABRT', 'SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2', 'SIGXCPU'];
                signals.forEach((eventType) => {
                    process.on(eventType, (signal) => {
                        try {
                            fs.removeSync(pidPath);
                        }
                        catch (e) { }
                        console.log(signal);
                        process.exit();
                    });
                });
            });
        }
        catch (e) {
            console.log(e);
            process.exit();
        }
    });
}
