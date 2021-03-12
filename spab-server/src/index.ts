// import config file
import './Config';

import * as process from 'process';
import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as fs from 'fs-extra';

import { SessionController } from './SessionController';
import { LoginController } from './LoginController';
import { WebSocketApi } from './WebSocketApi';
import { RestApi } from './RestApi';
import { Pool } from 'pg';


async function main() {
    try {
        const pidPath = path.resolve(__dirname, '../spab_run.pid');

        if (!await fs.pathExists(pidPath)) {
            await fs.writeFile(path.resolve(__dirname, '../spab_run.pid'), process.pid.toString());

            ['exit', 'uncaughtException', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'].forEach((eventType) => {
                process.on(eventType as any, () => {
                    try {
                        fs.removeSync(pidPath);
                    } catch (e) { }
                    
                    if (eventType !== 'exit') {
                        process.exit();
                    }
                });
            });
        } else {
            console.log('spab_run.pid exists');
            return;
        }

        const app = express();
        const httpServer = http.createServer(app);
    
        const pool = new Pool({
            host: DB_HOST,
            port: DB_PORT,
            database: DB_NAME,
            user: DB_USER,
            password: DB_PASSWORD,
        });
    
        // start app
        let sessionController = new SessionController();
        let loginController = new LoginController();
        let restApi = new RestApi(app, sessionController, loginController);
        let websocketApi = new WebSocketApi(httpServer, sessionController, loginController);
    
        sessionController.updateDbPool(pool);
        loginController.updateDbPool(pool);
        restApi.updateDbPool(pool);
        websocketApi.updateDbPool(pool);
    
        httpServer.listen(PORT);
    } catch (e) {}
}

main();

