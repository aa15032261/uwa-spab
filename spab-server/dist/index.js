"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import config file
require("./Config");
const http = require("http");
const express = require("express");
const WebSocketApi_1 = require("./WebSocketApi");
const RestApi_1 = require("./RestApi");
const MongoDbConnection_1 = require("./MongoDbConnection");
function main() {
    const app = express();
    const httpServer = http.createServer(app);
    let restApi = new RestApi_1.RestApi(app);
    let websocketApi = new WebSocketApi_1.WebSocketApi(httpServer);
    new MongoDbConnection_1.MongoDbConnection('mongodb://' + encodeURIComponent(MONGO_USER) + ':' + encodeURIComponent(MONGO_PASSWORD) + '@' + MONGO_URL + '/admin', { poolSize: 8, useNewUrlParser: true, useUnifiedTopology: true }, (client) => {
        let db = client.db(MONGO_DB_NAME);
        restApi.updateDbPool(db);
        websocketApi.updateDbPool(db);
    });
    httpServer.listen(PORT);
}
main();
