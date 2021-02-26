// import config file
import './Config';

import * as http from 'http';
import * as express from 'express';
import { Server } from 'socket.io';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";

function main() {
    const app = express();
    const httpServer = http.createServer(app);

    const clientIo = new Server(httpServer, {
        path: CLIENT_API_PATH
    });
    const guiIo = new Server(httpServer, {
        path: GUI_API_PATH
    });

    clientIo.on("connection", (socket) => {
        //TODO: auth

        console.log('connect');
        socket.emit('isOnline', true);
        
        socket.on('log', (camData: SpabDataStruct.ILog) => {
            guiIo.emit('camData', camData);
        });
    });

    httpServer.listen(8765);
}

main();