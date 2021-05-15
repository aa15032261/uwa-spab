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
import { O_CREAT, O_SYNC, O_WRONLY } from 'constants';

main();

/**
 * spab-server entry point
 */
async function main() {
    try {
        const app = express();
        const httpServer = http.createServer(app);
    
        // Creates a Postgres connection pool
        const pool = new Pool({
            host: DB_HOST,
            port: DB_PORT,
            database: DB_NAME,
            user: DB_USER,
            password: DB_PASSWORD,
        });
    
        // Initialises main components
        let sessionController = new SessionController();
        let loginController = new LoginController();
        let restApi = new RestApi(app, sessionController, loginController);
        let websocketApi = new WebSocketApi(httpServer, sessionController, loginController);
    
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
                process.on(eventType as any, (e) => {
                    try {
                        fs.removeSync(pidPath);
                    } catch (e) { }
                    
                    console.log(e);
        
                    if (eventType !== 'exit') {
                        process.exit();
                    }
                });
            });
        
            // Removes process id if the app is interupted
            let signals: NodeJS.Signals[] = ['SIGABRT', 'SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2', 'SIGXCPU'];
            signals.forEach((eventType) => {
                process.on(eventType, (signal: NodeJS.Signals) => {
                    try {
                        fs.removeSync(pidPath);
                    } catch (e) { }
                    
                    console.log(signal);
                    process.exit();
                });
            });
        });

        
    } catch (e) {
        console.log(e);
        process.exit();
    }
}
