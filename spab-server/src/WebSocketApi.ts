// import config file
import './Config';

import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";

export class WebSocketApi {
    constructor(httpServer: http.Server) {
        
        const clientIo = new Server(httpServer, {
            path: CLIENT_API_PATH
        });
        const guiIo = new Server(httpServer, {
            path: GUI_API_PATH
        });
    
        clientIo.on("connection", (socket: Socket) => {
            //TODO: auth
    
            console.log('connect');
            socket.emit('isPolling', true);

            setTimeout(() => {
                socket.emit('isPolling', false);
                console.log('stop');
            }, 10000);
            
            socket.on('log', (log, ackCallback) => {
    
                if (ackCallback) {
                    console.log(log);
                    ackCallback(true);
                }
                //guiIo.emit('camData', camData);
            }, );
        });
    }
}