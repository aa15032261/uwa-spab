"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import config file
require("./Config");
const http = require("http");
const express = require("express");
const WebSocketApi_1 = require("./WebSocketApi");
const RestApi_1 = require("./RestApi");
function main() {
    const app = express();
    const httpServer = http.createServer(app);
    new RestApi_1.RestApi(app);
    new WebSocketApi_1.WebSocketApi(httpServer);
    httpServer.listen(PORT);
}
main();
