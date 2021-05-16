"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
// import config file
require("./Config");
const otplib_1 = require("otplib");
const socket_io_client_1 = require("socket.io-client");
const net = require("net");
class MainController {
    constructor() {
        this._localSockets = new Set();
        // init socket io
        this._socket = socket_io_client_1.io(SERVER_URL, {
            path: PASSTHROUGH_WSAPI_PATH,
            rejectUnauthorized: false,
            autoConnect: true,
            reconnectionDelayMax: 10000,
            reconnectionAttempts: Infinity,
            auth: (cb) => {
                let authObj = {
                    token: CLIENT_API_TOKEN,
                    twoFactor: ''
                };
                if (CLIENT_TWO_FACTOR.type === 'totp') {
                    authObj.twoFactor = otplib_1.authenticator.generate(CLIENT_TWO_FACTOR.secret);
                }
                cb(authObj);
            }
        });
        let server = net.createServer((socket) => {
            this._localSockets.add(socket);
            socket.on('data', (data) => {
                if (this._checkOnline()) {
                    this._socket.emit('rawData', data);
                }
            });
            socket.on('end', () => {
                this._localSockets.delete(socket);
            });
        });
        server.on('error', (e) => { });
        server.listen(LOCAL_PORT, '127.0.0.1');
        this._socket.on('connect', () => {
            this._connectHandler();
        });
        this._socket.on('reconnect', () => {
            this._connectHandler();
        });
        this._socket.on('connect_error', (err) => {
            this._disconnectHandler(err);
        });
        this._socket.on('disconnect', (reason) => {
            this._disconnectHandler(reason);
            // reconnect in 30 seconds if kicked by the server
            setTimeout(() => {
                this._socket.connect();
            }, 30000);
        });
        this._socket.on('rawData', (data) => {
            for (let socket of this._localSockets) {
                socket.write(data);
            }
        });
    }
    _connectHandler() {
        console.log('server connected');
        this._socket.sendBuffer = [];
    }
    _disconnectHandler(err) {
        console.log('server disconnected');
    }
    ;
    _checkOnline() {
        if (this._socket.connected) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.MainController = MainController;
