"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import config file
require("./Config");
const http = require("http");
const express = require("express");
const socket_io_1 = require("socket.io");
function main() {
    const app = express();
    const httpServer = http.createServer(app);
    const clientIo = new socket_io_1.Server(httpServer, {
        path: CLIENT_API_PATH
    });
    const guiIo = new socket_io_1.Server(httpServer, {
        path: GUI_API_PATH
    });
    clientIo.on("connection", (socket) => {
        //TODO: auth
        socket.on('camData', (camData) => {
            guiIo.emit('camData', camData);
        });
    });
    httpServer.listen(8765);
}
main();
