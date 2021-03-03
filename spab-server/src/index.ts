// import config file
import './Config';

import * as http from 'http';
import * as express from 'express';

import { MongoDbConnection } from './MongoDbConnection';
import { SessionController } from './SessionController';
import { LoginController } from './LoginController';
import { WebSocketApi } from './WebSocketApi';
import { RestApi } from './RestApi';
import { Session } from 'express-session';

function main() {
    const app = expres();
    const httpServer = http.createServer(app);

    new MongoDbConnection(
        'mongodb://' + encodeURIComponent(MONGO_USER) + ':' + encodeURIComponent(MONGO_PASSWORD) + '@' + MONGO_URL + '/admin',
        { poolSize: 8, useNewUrlParser: true, useUnifiedTopology: true },
        (client) => {
            let db = client.db(MONGO_DB_NAME);

            // start app
            let sessionController = new SessionController();
            let loginController = new LoginController();
            let restApi = new RestApi(app, sessionController, loginController);
            let websocketApi = new WebSocketApi(httpServer, sessionController, loginController);

            sessionController.updateDbPool(db);
            loginController.updateDbPool(db);
            restApi.updateDbPool(db);
            websocketApi.updateDbPool(db);
        }
    )

    httpServer.listen(PORT);
}

main();