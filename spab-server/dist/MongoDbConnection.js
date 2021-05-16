"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDbConnection = void 0;
const mongodb = require("mongodb");
/**
   * @class MongoDbConnection
   *
   * Connects to mongodb and handles connected, reconnected and disconnected states.
   *
   * For mongodb_option, visit:
   * https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html
   *
   * @constructor
   * @param {String} mongodb_url Mongo url.
   * @param {Object} mongodb_option Mongo connection options.
   * @param {Function} connected_callback Connected callback.
   * @param {Function} reconnected_callback Reconnected callback.
   * @param {Function} disconnected_callback Disconnected callback.
   */
class MongoDbConnection {
    constructor(mongodb_url, mongodb_option, connected_callback) {
        this._isConnected = false;
        if (!(mongodb_option instanceof Object)) {
            mongodb_option = {};
        }
        mongodb_option.useNewUrlParser = true;
        mongodb_option.useUnifiedTopology = true;
        let _connectMongoDb = () => {
            mongodb.MongoClient.connect(mongodb_url, mongodb_option).then((db) => {
                console.log('mongodb connected');
                this._isConnected = true;
                connected_callback(db);
            }).catch((err) => {
                console.log('mongodb disconnected:');
                console.log(err);
                setTimeout(_connectMongoDb, 5000);
            });
        };
        _connectMongoDb();
    }
    get isConnected() {
        return this._isConnected;
    }
}
exports.MongoDbConnection = MongoDbConnection;
