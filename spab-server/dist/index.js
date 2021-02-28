"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import config file
require("./Config");
const http = require("http");
const express = require("express");
const MongoDbConnection_1 = require("./MongoDbConnection");
const SessionController_1 = require("./SessionController");
const LoginController_1 = require("./LoginController");
const WebSocketApi_1 = require("./WebSocketApi");
const RestApi_1 = require("./RestApi");
function main() {
    const app = express();
    const httpServer = http.createServer(app);
    new MongoDbConnection_1.MongoDbConnection('mongodb://' + encodeURIComponent(MONGO_USER) + ':' + encodeURIComponent(MONGO_PASSWORD) + '@' + MONGO_URL + '/admin', { poolSize: 8, useNewUrlParser: true, useUnifiedTopology: true }, (client) => {
        let db = client.db(MONGO_DB_NAME);
        // start app
        let sessionController = new SessionController_1.SessionController();
        let loginController = new LoginController_1.LoginController();
        let restApi = new RestApi_1.RestApi(app, sessionController, loginController);
        let websocketApi = new WebSocketApi_1.WebSocketApi(httpServer, sessionController, loginController);
        sessionController.updateDbPool(db);
        loginController.updateDbPool(db);
        restApi.updateDbPool(db);
        websocketApi.updateDbPool(db);
    });
    httpServer.listen(PORT);
}
main();
