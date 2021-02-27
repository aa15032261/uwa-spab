// import config file
import './Config';

import * as http from 'http';
import * as express from 'express';
import { WebSocketApi } from './WebSocketApi';
import { RestApi } from './RestApi';
import { MongoDbConnection } from './MongoDbConnection';

function main() {
    const app = express();
    const httpServer = http.createServer(app);

    let restApi = new RestApi(app);
    let websocketApi = new WebSocketApi(httpServer);

    new MongoDbConnection(
        'mongodb://' + encodeURIComponent(MONGO_USER) + ':' + encodeURIComponent(MONGO_PASSWORD) + '@' + MONGO_URL + '/admin',
        { poolSize: 8, useNewUrlParser: true, useUnifiedTopology: true },
        (client) => {
            let db = client.db(MONGO_DB_NAME);

            restApi.updateDbPool(db);
            websocketApi.updateDbPool(db);
        }
    )

    httpServer.listen(PORT);
}

main();