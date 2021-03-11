// import config file
import './Config';

import * as http from 'http';
import * as express from 'express';

import { SessionController } from './SessionController';
import { LoginController } from './LoginController';
import { WebSocketApi } from './WebSocketApi';
import { RestApi } from './RestApi';
import { Pool } from 'pg';

async function main() {
    try {
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