import * as mongodb from 'mongodb';

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
export class MongoDbConnection {
    private _isConnected = false;

    constructor (
        mongodb_url: string, 
        mongodb_option: mongodb.MongoClientOptions, 
        connected_callback: (db: mongodb.MongoClient) => void
    ) {
        if (!(mongodb_option instanceof Object)) {
            mongodb_option = {};
        }

        mongodb_option.useNewUrlParser = true;
        mongodb_option.useUnifiedTopology = true;

        let _connectMongoDb = () => {
            mongodb.MongoClient.connect(
                mongodb_url,
                mongodb_option
            ).then((db) => {
                console.log('database connect');
                this._isConnected = true;
                connected_callback(db);
            }).catch((err) => {
                console.log('cannot connect to database...:');
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
