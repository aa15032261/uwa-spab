// import config file
import './Config';

import * as http from 'http';
import * as express from 'express';
import { Server } from 'socket.io';


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
        
        socket.on('camData', (camData: any) => {
            guiIo.emit('camData', camData);
        });
    });

    httpServer.listen(8765);
}

main();