// import config file
import './Config';

import * as http from 'http';
import * as express from 'express';
import { WebSocketApi } from './WebSocketApi';
import { RestApi } from './RestApi';

function main() {
    const app = express();
    const httpServer = http.createServer(app);

    new RestApi(app);
    new WebSocketApi(httpServer);

    httpServer.listen(PORT);
}

main();