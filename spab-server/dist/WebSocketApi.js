"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketApi = void 0;
const tslib_1 = require("tslib");
// import config file
require("./Config");
const socket_io_1 = require("socket.io");
const cookie = require("cookie");
const otplib_1 = require("otplib");
const ClientStore_1 = require("./ClientStore");
class WebSocketApi {
    /**
     * WebSocketApi handles WebSocket APIs
     *
     * @param {http.Server} httpServer
     * @param {SessionController} sessionController
     * @param {LoginController} loginController
     */
    constructor(httpServer, sessionController, loginController) {
        // totp settings to accept token within +/- 1 minutes
        otplib_1.totp.options = { window: [-2, 2] };
        this._clientStore = new ClientStore_1.ClientStore();
        // initialise the passthrough socket server
        this._passthroughIo = new socket_io_1.Server(httpServer, {
            path: PASSTHROUGH_WSAPI_PATH
        });
        // initialise the client socket server
        this._clientIo = new socket_io_1.Server(httpServer, {
            path: CLIENT_WSAPI_PATH
        });
        // initialise the gui socket server
        this._guiIo = new socket_io_1.Server(httpServer, {
            path: GUI_WSAPI_PATH
        });
        // handle new passthrough connections
        this._passthroughIo.on('connection', (socket) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._pool) {
                    throw 'db not ready';
                }
                if (!socket.handshake.auth) {
                    throw 'invalid request';
                }
                // authenticates client token and two-factor password
                let socketAuthObj = socket.handshake.auth;
                let clientId = yield this._clientAuth(socketAuthObj.token, socketAuthObj.twoFactor);
                if (!clientId) {
                    throw 'authentication failed';
                }
                // setup the passthrough socket
                yield this._setupPassthroughSocket(clientId, socket);
            }
            catch (e) {
                // error occured on the server side or authentication failed
                socket.disconnect(true);
            }
        }));
        // handle new client connections
        this._clientIo.on('connection', (socket) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._pool) {
                    throw 'db not ready';
                }
                if (!socket.handshake.auth) {
                    throw 'invalid request';
                }
                // authenticates client token and two-factor password
                let socketAuthObj = socket.handshake.auth;
                let clientId = yield this._clientAuth(socketAuthObj.token, socketAuthObj.twoFactor);
                if (!clientId) {
                    throw 'authentication failed';
                }
                // setup the client socket
                yield this._setupClientSocket(clientId, socket);
            }
            catch (e) {
                // error occured on the server side or authentication failed
                socket.disconnect(true);
            }
        }));
        // handle new gui connections
        this._guiIo.on('connection', (socket) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!this._pool) {
                    throw 'db not ready';
                }
                if (!socket.handshake.headers.cookie) {
                    throw 'invalid request';
                }
                // authenticates the gui connection using cookie
                let cookies = cookie.parse(socket.handshake.headers.cookie);
                let sessionStruct = yield sessionController.getSessionStruct(cookies[SESSION_NAME], socket.handshake.headers, socket.handshake.address);
                yield loginController.getLoginStatus(socket, sessionStruct);
                if (!((_a = socket.loginStatus) === null || _a === void 0 ? void 0 : _a.loggedIn)) {
                    throw 'authentication failed';
                }
                // setup the gui socket
                this._setupGuiSocket(socket);
            }
            catch (e) {
                // error occured on the server side or authentication failed
                socket.disconnect(true);
            }
        }));
    }
    /**
     * Authenticates the client credentials
     *
     * @param {string} token - The client token
     * @param {string} twoFactorToken - The two-factor token
     * @returns {Promise<string | undefined>} - Returns the client id if authenticated, otherwise, undefined.
     */
    _clientAuth(token, twoFactorToken) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let clientObj = (yield this._pool.query(`SELECT "_id", "name", "twoFactor" FROM clients WHERE token=$1`, [token])).rows[0];
            if (!clientObj) {
                return;
            }
            let authenticated = false;
            if (((_a = clientObj.twoFactor) === null || _a === void 0 ? void 0 : _a.type) === 'totp' && ((_b = clientObj.twoFactor) === null || _b === void 0 ? void 0 : _b.secret)) {
                authenticated = otplib_1.authenticator.verify({
                    token: twoFactorToken,
                    secret: clientObj.twoFactor.secret
                });
            }
            if (authenticated) {
                return clientObj._id;
            }
            yield this._clientStore.createClient(clientObj._id, clientObj.name);
            return;
        });
    }
    /**
     * Setup client socket APIs.
     *
     * API:
     * log - logClientEncoded, ackResponse(optional)
     * standard log messages
     *
     * rawData - data
     * passthrough mode data
     *
     * @param {string} clientId
     * @param {Socket} socket
     */
    _setupClientSocket(clientId, socket) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // add client's socket id to the client store
            if (this._clientStore.addClientSocketId(clientId, socket.id)) {
                // notify all gui sockets that the client is online
                this._broadcastToGui('online', [clientId], true);
                // if there is at least 1 gui socket subscribes to the client,
                // notify the client to enter polling mode.
                let guiCount = yield this._getClientGuiCount(clientId);
                if (guiCount > 0) {
                    this._sendMsgAck(socket, 'polling', [true], true);
                }
                // if there is at least 1 passthrough socket subscribes to the client,
                // notify the client to enter passthrough mode.
                let passthroughcount = yield this._getClientPassthroughCount(clientId);
                if (passthroughcount > 0) {
                    this._sendMsgAck(socket, 'passthrough', [true], true);
                }
            }
            socket.on('disconnect', () => {
                // remove client's socket id from the client store
                if (this._clientStore.removeClientSocketId(clientId, socket.id)) {
                    // notify all gui sockets that the client is offline
                    this._broadcastToGui('offline', [clientId], true);
                }
            });
            socket.on('log', (logClientEncoded, ackResponse) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                // optional ack response 
                if (ackResponse instanceof Function) {
                    ackResponse(true);
                }
                if (!logClientEncoded) {
                    return;
                }
                // add encoded log to the store
                let spabLog = yield this._clientStore.addLogEncoded(clientId, logClientEncoded);
                // if the log is valid
                if (spabLog) {
                    // broadcast the new log to the gui sockets subscribed to the client
                    yield this._sendToGuiSubscriber(clientId, 'log', [
                        this._clientStore.getLogGui(clientId, spabLog)
                    ], false);
                }
            }));
            socket.on('rawData', (data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                // broadcast passthrough mode data to the passthrough sockets subscribed to the client
                yield this._sendToPassthroughSubscriber(clientId, 'rawData', [data], false);
            }));
        });
    }
    /**
     * Setup passthrough socket APIs.
     *
     * API:
     * rawData - data
     * passthrough mode data
     *
     * @param {string} clientId
     * @param {Socket & PassthroughStatus} socket
     */
    _setupPassthroughSocket(clientId, socket) {
        socket.passthroughStatus = {
            clientId: clientId
        };
        socket.on('rawData', (data) => {
            // send passthrough mode data to the client
            this._sendToClient(clientId, 'rawData', [data], false);
        });
        socket.on('disconnect', (err) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // if there is no passthrough sockets subscribed to the client
            let count = yield this._getClientPassthroughCount(clientId);
            if (count === 0) {
                // notify the client to exit passthrough mode.
                this._sendToClient(clientId, 'passthrough', [false], true);
            }
        }));
        // notify the client to enter passthrough mode
        this._sendToClient(clientId, 'passthrough', [true], true);
    }
    /**
     * Setup gui socket APIs.
     *
     * API:
     * get - cmd, ackResponse
     * cmd options:
     * clients - get all clients
     *
     * log - clientId, timestamp, ackResponse
     * get all logs at the given timestamp
     *
     * subscribe - clientId, ackResponse
     * subscribe a client
     *
     * unsubscribe - clientId, ackResponse
     * unsubscribe a client
     *
     * unsubscribeAll - ackResponse
     * unsubscribe all clients
     *
     * @param {string} clientId
     * @param {Socket & LoginStatus & GuiStatus} socket
     */
    _setupGuiSocket(socket) {
        socket.guiStatus = {
            subscribedClientIds: new Set()
        };
        socket.on('get', (cmd, ackResponse) => {
            if (!(ackResponse instanceof Function)) {
                return;
            }
            // return cmd data
            if (cmd === 'clients') {
                ackResponse(this._clientStore.getClientSummary());
            }
        });
        socket.on('log', (clientId, timestamp, ackResponse) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // ack response
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);
            // send logs at the specified timestamp to the gui socket
            yield this._sendLogs(clientId, timestamp, socket);
        }));
        socket.on('subscribe', (clientId, ackResponse) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // ack response
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);
            // add the client id to subscribed list
            socket.guiStatus.subscribedClientIds.add(clientId);
            // notify the client to enter polling mode
            yield this._setClientPolling(clientId, true);
            // send the most recent logs to the gui socket
            yield this._sendLogs(clientId, -1, socket);
        }));
        socket.on('unsubscribe', (clientId, ackResponse) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // ack response
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);
            // remove the client id from subscribed list
            socket.guiStatus.subscribedClientIds.delete(clientId);
            // notify the client to exit polling mode if it has no subsribers
            yield this._setClientPolling(clientId, false);
        }));
        socket.on('unsubscribeAll', (ackResponse) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // ack response
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);
            // unsubscribe all clients
            yield this._handleGuiUnsubscribeAll(socket);
        }));
        socket.on('disconnect', (err) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // unsubscribe all clients
            yield this._handleGuiUnsubscribeAll(socket);
        }));
    }
    /**
     * Unsubscribe all clients for a gui socket
     *
     * @param {Socket & LoginStatus & GuiStatus} socket
     */
    _handleGuiUnsubscribeAll(socket) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (socket.guiStatus) {
                for (let clientId of socket.guiStatus.subscribedClientIds) {
                    // remove the client id from subscribed list
                    socket.guiStatus.subscribedClientIds.delete(clientId);
                    // notify the client to exit polling mode if it has no subsribers
                    yield this._setClientPolling(clientId, false);
                }
            }
        });
    }
    /**
     * Send logs at the specified timestamp to a gui socket
     *
     * @param {string} clientId
     * @param {number} timestamp
     * @param {Socket} socket
     */
    _sendLogs(clientId, timestamp, socket) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let client = this._clientStore.getClient(clientId);
            if (!client) {
                return;
            }
            // if the timestamp is a positive number,
            // get the logs from client store;
            // otherwise get the most recent logs
            let logs = client.latestLogs;
            if (timestamp > 0) {
                logs = yield this._clientStore.getLogs(clientId, timestamp);
            }
            // send the log to the gui socket
            for (let spabLog of logs) {
                this._sendMsgAck(socket, 'log', [
                    this._clientStore.getLogGui(clientId, spabLog)
                ], true);
            }
        });
    }
    /**
     * Get the number of gui socket subscribed to the client
     *
     * @param {string} clientId
     * @returns {Promise<number>}
     */
    _getClientGuiCount(clientId) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let count = 0;
            for (let [socketId, socket] of yield this._guiIo.sockets.sockets) {
                try {
                    let guiSocket = socket;
                    if ((_a = guiSocket.loginStatus) === null || _a === void 0 ? void 0 : _a.loggedIn) {
                        if (guiSocket.guiStatus.subscribedClientIds.has(clientId)) {
                            count++;
                        }
                    }
                }
                catch (e) { }
            }
            return count;
        });
    }
    /**
     * Get the number of passthrough socket subscribed to the client
     *
     * @param clientId
     * @returns {Promise<number>}
     */
    _getClientPassthroughCount(clientId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let count = 0;
            for (let [socketId, socket] of yield this._passthroughIo.sockets.sockets) {
                try {
                    let passthroughSocket = socket;
                    if (passthroughSocket.passthroughStatus.clientId === clientId) {
                        count++;
                    }
                }
                catch (e) { }
            }
            return count;
        });
    }
    /**
     * Update client's polling mode
     *
     * @param {string} clientId
     * @param {boolean} isPolling
     * @returns {Promise<void>}
     */
    _setClientPolling(clientId, isPolling) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // if the client is not connected to the server, 
            // ignore the function call
            if (this._clientStore.getSocketCount(clientId) <= 0) {
                return;
            }
            // if there is 0 subscribers and polling is set to false
            // or there is 1 subscriber and polling is set to true,
            // update client's polling mode
            let count = yield this._getClientGuiCount(clientId);
            if ((count === 1 && isPolling === true) ||
                (count === 0 && isPolling === false)) {
                this._sendToClient(clientId, 'polling', [isPolling], true);
            }
        });
    }
    /**
     * Send an event to a client
     *
     * @param {string} clientId
     * @param {string} evt - Event type
     * @param {any[]} val - Event parameters
     * @param {boolean} ack - True if the message requires an ack response, otherwise, false.
     */
    _sendToClient(clientId, evt, val, ack) {
        let client = this._clientStore.getClient(clientId);
        if (client) {
            for (let socketId of client.socketIds) {
                let socket = this._clientIo.sockets.sockets.get(socketId);
                if (socket) {
                    this._sendMsgAck(socket, evt, val, ack);
                }
            }
        }
    }
    /**
     * Send an event to the gui sockets subscribed to a client
     *
     * @param {string} clientId
     * @param {string} evt - Event type
     * @param {any[]} values - Event parameters
     * @param {boolean} ack - True if the message requires an ack response, otherwise, false
     */
    _sendToGuiSubscriber(clientId, evt, val, ack) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let [socketId, socket] of yield this._guiIo.sockets.sockets) {
                try {
                    let guiSocket = socket;
                    if ((_a = guiSocket.loginStatus) === null || _a === void 0 ? void 0 : _a.loggedIn) {
                        if (guiSocket.guiStatus.subscribedClientIds.has(clientId)) {
                            this._sendMsgAck(socket, evt, val, ack);
                        }
                    }
                }
                catch (e) { }
            }
        });
    }
    /**
     * Send an event to the passthrough sockets subscribed to a client
     *
     * @param {string} clientId
     * @param {string} evt - Event type
     * @param {any[]} val - Event parameters
     * @param {boolean} ack - True if the message requires an ack response, otherwise, false
     */
    _sendToPassthroughSubscriber(clientId, evt, val, ack) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let [socketId, socket] of yield this._passthroughIo.sockets.sockets) {
                try {
                    let passthroughSocket = socket;
                    if (((_a = passthroughSocket.passthroughStatus) === null || _a === void 0 ? void 0 : _a.clientId) === clientId) {
                        this._sendMsgAck(socket, evt, val, ack);
                    }
                }
                catch (e) { }
            }
        });
    }
    /**
     * Send an event to all gui sockets
     *
     * @param {string} evt - Event type
     * @param {any[]} val - Event parameters
     * @param {boolean} ack - True if the message requires an ack response, otherwise, false.
     */
    _broadcastToGui(evt, val, ack) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let [socketId, socket] of yield this._guiIo.sockets.sockets) {
                let guiSocket = socket;
                if ((_a = guiSocket.loginStatus) === null || _a === void 0 ? void 0 : _a.loggedIn) {
                    this._sendMsgAck(guiSocket, evt, val, ack);
                }
            }
        });
    }
    /**
     * Send an event to a socket
     *
     * @param {Socket} socket
     * @param {string} evt - Event type
     * @param {any[]} val - Event parameters
     * @param {boolean} ack - True if the message requires an ack response, otherwise, false.
     * @returns {Promise<any>} - Return response if the operation is succussful, otherwise, undefined
     */
    _sendMsgAck(socket, evt, val, ack) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (ack) {
                for (let i = 0; i < 3; i++) {
                    try {
                        return yield this._sendMsgAckOnce(socket, evt, val, (i + 1) * 10000);
                    }
                    catch (e) { }
                    ;
                }
            }
            else {
                socket.emit(evt, ...val);
            }
            return;
        });
    }
    /**
     * Send an event to a socket once
     *
     * @param {Socket} socket
     * @param {string} evt - Event type
     * @param {any[]} val - Event parameters
     * @param {number} timeout - Timeout for the operation
     * @returns {Promise<any>} - Return response if the operation is succussful, otherwise, undefined
     */
    _sendMsgAckOnce(socket, evt, val, timeout) {
        return new Promise((resolve, reject) => {
            // throw error if the operation is taking too long
            setTimeout(() => {
                reject('timeout');
            }, timeout);
            // return response
            socket.emit(evt, ...val, (res) => {
                resolve(res);
            });
        });
    }
    /**
     * Update Postgre database pool
     *
     * @param {Pool} pool - Postgre pool
     */
    updateDbPool(pool) {
        this._pool = pool;
        this._clientStore.updateDbPool(pool);
    }
}
exports.WebSocketApi = WebSocketApi;
