// import config file
import './Config';

import * as http from 'http';
import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';

import { authenticator, totp } from 'otplib';
import { SessionController } from './SessionController';
import { LoginController, LoginStatus } from './LoginController';
import { ClientStore, DbLog, SpabLog } from './ClientStore';
import { Pool } from 'pg';

/**
 * Contain additional information for gui sockets
 */
interface GuiStatus {
    /** Status of the gui socket */
    guiStatus?: {
        /** Subscribed client ids */
        subscribedClientIds: Set<string>
    }
}

/**
 * Contain additional information for passthrough sockets
 */
interface PassthroughStatus {
    /** Status of the passthrough socket */
    passthroughStatus?: {
        /** Connected client id */
        clientId: string
    }
}


export class WebSocketApi {

    /** postgres connection pool */
    private _pool?: Pool;

    /** passthrough socket server */
    private _passthroughIo: Server;

    /** client socket server */
    private _clientIo: Server;

    /** gui socket server */
    private _guiIo: Server;

    /** client in-memory store */
    private _clientStore: ClientStore;


    /**
     * Initialise a http server to handle WebSocket APIs
     * 
     * @param {http.Server} httpServer 
     * @param {SessionController} sessionController 
     * @param {LoginController} loginController 
     */
    constructor(
        httpServer: http.Server, 
        sessionController: SessionController,
        loginController: LoginController
    ) {
        // totp settings to accept token within +/- 1 minutes
        totp.options = { window: [-2, 2] };

        this._clientStore = new ClientStore();

        // initialise the passthrough socket server
        this._passthroughIo = new Server(httpServer, {
            path: PASSTHROUGH_WSAPI_PATH
        });

        // initialise the client socket server
        this._clientIo = new Server(httpServer, {
            path: CLIENT_WSAPI_PATH
        });

        // initialise the gui socket server
        this._guiIo = new Server(httpServer, {
            path: GUI_WSAPI_PATH
        });

        // handle new passthrough connections
        this._passthroughIo.on('connection', async (socket: Socket) => {
            try {
                if (!this._pool) {
                    throw 'db not ready';
                }

                if (!socket.handshake.auth) {
                    throw 'invalid request';
                }

                // authenticates client token and two-factor password
                let socketAuthObj = socket.handshake.auth as {token: string, twoFactor: string};
                let clientId = await this._clientAuth(socketAuthObj.token, socketAuthObj.twoFactor);
                if (!clientId) {
                    throw 'authentication failed';
                }

                // setup the passthrough socket
                await this._setupPassthroughSocket(clientId, socket);
            } catch (e) {
                // error occured on the server side or authentication failed
                socket.disconnect(true);
            }
        });
    
        // handle new client connections
        this._clientIo.on('connection', async (socket: Socket) => {
            try {
                if (!this._pool) {
                    throw 'db not ready';
                }

                if (!socket.handshake.auth) {
                    throw 'invalid request';
                }

                // authenticates client token and two-factor password
                let socketAuthObj = socket.handshake.auth as {token: string, twoFactor: string};
                let clientId = await this._clientAuth(socketAuthObj.token, socketAuthObj.twoFactor);
                if (!clientId) {
                    throw 'authentication failed';
                }

                // setup the client socket
                await this._setupClientSocket(clientId, socket);
            } catch (e) {
                // error occured on the server side or authentication failed
                socket.disconnect(true);
            }
        });

        // handle new gui connections
        this._guiIo.on('connection', async (socket: Socket & LoginStatus) => {
            try {
                if (!this._pool) {
                    throw 'db not ready';
                }

                if (!socket.handshake.headers.cookie) {
                    throw 'invalid request';
                }

                // authenticates the gui connection using cookie
                let cookies = cookie.parse(socket.handshake.headers.cookie);
                let sessionStruct = await sessionController.getSessionStruct(
                    cookies[SESSION_NAME], 
                    socket.handshake.headers, 
                    socket.handshake.address
                )
                await loginController.getLoginStatus(socket, sessionStruct);
                if (!(socket.loginStatus?.loggedIn)) {
                    throw 'authentication failed';
                }

                // setup the gui socket
                this._setupGuiSocket(socket);
            } catch (e) {
                // error occured on the server side or authentication failed
                socket.disconnect(true);
            }
        });
    }

    /**
     * Authenticates the client credentials
     * 
     * @param {string} token - The client token
     * @param {string} twoFactorToken - The two-factor token
     * @returns {string | undefined} - Returns the client id if authenticated, otherwise, undefined.
     */
    private async _clientAuth(token: string, twoFactorToken: string): Promise<string | undefined> {
        let clientObj = (await this._pool!.query(
            `SELECT "_id", "name", "twoFactor" FROM clients WHERE token=$1`,
            [token]
        )).rows[0];

        if (!clientObj) {
            return;
        }

        let authenticated = false;

        if (clientObj.twoFactor?.type === 'totp' && clientObj.twoFactor?.secret) {
            authenticated = authenticator.verify({
                token: twoFactorToken, 
                secret: clientObj.twoFactor.secret
            });
        }

        if (authenticated) {
            return clientObj._id
        }

        await this._clientStore.createClient(
            clientObj._id,
            clientObj.name
        );
        
        return;
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
    private async _setupClientSocket(clientId: string, socket: Socket) {

        // add client's socket id to the client store
        if (this._clientStore.addClientSocketId(clientId, socket.id)) {
            // notify all gui sockets that the client is online
            this._broadcastToGui('online', [clientId], true);

            // if there is at least 1 gui socket subscribes to the client,
            // notify the client to enter polling mode.
            let guiCount = await this._getClientGuiCount(clientId);
            if (guiCount > 0) {
                this._sendMsgAck(socket, 'polling', [true], true);
            }

            // if there is at least 1 passthrough socket subscribes to the client,
            // notify the client to enter passthrough mode.
            let passthroughcount = await this._getClientPassthroughCount(clientId);
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

        socket.on('log', async (logClientEncoded, ackResponse) => {
            // optional ack response 
            if (ackResponse instanceof Function) {
                ackResponse(true);
            }

            if (!logClientEncoded) {
                return;
            }

            // add encoded log to the store
            let spabLog = await this._clientStore.addLogEncoded(
                clientId,
                logClientEncoded
            );

            // if the log is valid
            if (spabLog) {
                // broadcast the new log to the gui sockets subscribed to the client
                await this._sendToGuiSubscriber(clientId, 'log', [
                    this._clientStore.getLogGui(clientId, spabLog)
                ], false);
            }
        });

        socket.on('rawData', async (data: Buffer) => {
            // broadcast passthrough mode data to the passthrough sockets subscribed to the client
            await this._sendToPassthroughSubscriber(clientId, 'rawData', [data], false);
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
    private _setupPassthroughSocket(clientId: string, socket: Socket & PassthroughStatus) {
        socket.passthroughStatus = {
            clientId: clientId
        };

        socket.on('rawData', (data: Buffer) => {
            // send passthrough mode data to the client
            this._sendToClient(clientId, 'rawData', [data], false);
        });

        socket.on('disconnect', async (err: any) => {
            // if there is no passthrough sockets subscribed to the client
            let count = await this._getClientPassthroughCount(clientId);
            if (count === 0) {
                // notify the client to exit passthrough mode.
                this._sendToClient(clientId, 'passthrough', [false], true);
            }
        });

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
    private _setupGuiSocket(socket: Socket & LoginStatus & GuiStatus) {
        socket.guiStatus = {
            subscribedClientIds: new Set<string>()
        }

        socket.on('get', (cmd: string, ackResponse) => {
            if (!(ackResponse instanceof Function)) {
                return;
            }

            // return cmd data
            if (cmd === 'clients') {
                ackResponse(this._clientStore.getClientList());
            }
        });

        socket.on('log', async (clientId: string, timestamp: number, ackResponse) => {
            // ack response
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);

            // send logs at the specified timestamp to the gui socket
            await this._sendLogs(clientId, timestamp, socket);
        });

        socket.on('subscribe', async (clientId: string, ackResponse) => {
            // ack response
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);

            // add the client id to subscribed list
            socket.guiStatus!.subscribedClientIds.add(clientId);

            // notify the client to enter polling mode
            await this._setClientPolling(clientId, true);

            // send the most recent logs to the gui socket
            await this._sendLogs(clientId, -1, socket);
        });

        socket.on('unsubscribe', async (clientId: string, ackResponse) => {
            // ack response
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);

            // remove the client id from subscribed list
            socket.guiStatus!.subscribedClientIds.delete(clientId);

            // notify the client to exit polling mode if it has no subsribers
            await this._setClientPolling(clientId, false);
        });

        socket.on('unsubscribeAll', async (ackResponse) => {
            // ack response
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);

            // unsubscribe all clients
            await this._handleGuiUnsubscribeAll(socket);
        });


        socket.on('disconnect', async (err: any) => {
            // unsubscribe all clients
            await this._handleGuiUnsubscribeAll(socket);
        });
    }


    /**
     * Unsubscribe all clients
     * 
     * @param {Socket & LoginStatus & GuiStatus} socket 
     */
    private async _handleGuiUnsubscribeAll(
        socket: Socket & LoginStatus & GuiStatus
    ) {
        if (socket.guiStatus) {
            for (let clientId of socket.guiStatus.subscribedClientIds) {
                socket.guiStatus!.subscribedClientIds.delete(clientId);
                await this._setClientPolling(clientId, false);
            }
        }
    }

    private async _sendLogs(
        clientId: string,
        timestamp: number,
        socket: Socket
    ) {
        let client = this._clientStore.getClient(clientId);

        if (!client) {
            return;
        }

        let logs = client.latestLogs;

        if (timestamp > 0) {
            logs = await this._clientStore.getLogs(clientId, timestamp);
        }

        for (let spabLog of logs) {
            this._sendMsgAck(socket, 'log', [
                this._clientStore.getLogGui(clientId, spabLog)
            ], true);
        }
    }


    private async _getClientGuiCount(clientId: string): Promise<number> {
        let count = 0;
        for (let [socketId, socket] of await this._guiIo.sockets.sockets) {
            try {
                let guiSocket = socket as Socket & LoginStatus & GuiStatus;
                if (guiSocket.loginStatus?.loggedIn) {
                    if (guiSocket.guiStatus!.subscribedClientIds.has(clientId)) {
                        count++;
                    }
                }
            } catch (e) {}
        }

        return count;
    }

    private async _getClientPassthroughCount(clientId: string): Promise<number> {
        let count = 0;

        for (let [socketId, socket] of await this._passthroughIo.sockets.sockets) {
            try {
                let passthroughSocket = socket as Socket & PassthroughStatus;

                if (passthroughSocket.passthroughStatus!.clientId === clientId) {
                    count++;
                }

            } catch (e) {}
        }

        return count;
    }

    private async _setClientPolling (
        clientId: string,
        isPolling: boolean
    ): Promise<any>  {

        if (this._clientStore.getSocketIdCount(clientId) <= 0) {
            return;
        }

        let count = await this._getClientGuiCount(clientId);

        if (
            (count === 1 && isPolling === true) ||
            (count === 0 && isPolling === false)
        ) {
            this._sendToClient(clientId, 'polling', [isPolling], true);
        }
    }

    private _sendToClient (
        clientId: string,
        evt: string, 
        values: any[],
        ack: boolean
    ) {
        let client = this._clientStore.getClient(clientId);
        if (client) {

            for (let socketId of client.socketIds) {
                let socket = this._clientIo.sockets.sockets.get(socketId);

                if (socket) {
                    this._sendMsgAck(socket, evt, values, ack);
                }
            }
        }
    }

    private async _sendToGuiSubscriber(
        clientId: string,
        evt: string, 
        val: any,
        ack: boolean
    ) {
        for (let [socketId, socket] of await this._guiIo.sockets.sockets) {
            try {
                let guiSocket = socket as Socket & LoginStatus & GuiStatus;
                if (guiSocket.loginStatus?.loggedIn) {
                    if (guiSocket.guiStatus!.subscribedClientIds.has(clientId)) {
                        this._sendMsgAck(socket, evt, val, ack);
                    }
                }
            } catch (e) {}
        }
    }

    private async _sendToPassthroughSubscriber(
        clientId: string,
        evt: string, 
        val: any,
        ack: boolean
    ) {
        for (let [socketId, socket] of await this._passthroughIo.sockets.sockets) {
            try {
                let passthroughSocket = socket as Socket & PassthroughStatus;
                if (passthroughSocket.passthroughStatus?.clientId === clientId) {
                    this._sendMsgAck(socket, evt, val, ack);
                }
            } catch (e) {}
        }
    }

    private async _broadcastToGui(
        evt: string, 
        values: any[],
        ack: boolean
    ): Promise<any>  {
        for (let [socketId, socket] of await this._guiIo.sockets.sockets) {
            let guiSocket = socket as Socket & LoginStatus;
            if (guiSocket.loginStatus?.loggedIn) {
                this._sendMsgAck(guiSocket, evt, values, ack);
            }
        }
    }

    private async _sendMsgAck(
        socket: Socket, 
        evt: string, 
        values: any[],
        ack: boolean
    ): Promise<any> {
        if (ack) {
            for (let i = 0; i < 3; i++) {
                try {
                    return await this._sendMsgAckOnce(socket, evt, values, (i + 1) * 10000);
                } catch (e) { };
            }
        } else {
            socket.emit(evt, ...values);
        }

        return;
    }

    private _sendMsgAckOnce(
        socket: Socket, 
        evt: string, 
        values: any[],
        timeout: number
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                reject()
            }, timeout);

            socket.emit(evt, ...values, (res: any) => {
                resolve(res);
            });
        })
    }


    public updateDbPool(pool: Pool) {
        this._pool = pool;
        this._clientStore.updateDbPool(pool);
    }
    
}