// import config file
import './Config';

import * as http from 'http';
import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";

import { authenticator, totp } from 'otplib';
import { SessionController } from './SessionController';
import { LoginController, LoginStatus } from './LoginController';
import { ClientStore, DbLog, SpabLog } from './ClientStore';
import { Pool } from 'pg';

interface GuiStatus {
    guiStatus?: {
        subscribedClientIds: Set<string>
    }
}

interface PassthroughStatus {
    passthroughStatus?: {
        clientId: string
    }
}

export class WebSocketApi {

    private _pool?: Pool;

    private _passthroughIo: Server;
    private _clientIo: Server;
    private _guiIo: Server;

    private _clientStore: ClientStore;

    constructor(
        httpServer: http.Server, 
        sessionController: SessionController,
        loginController: LoginController
    ) {

        totp.options = { window: [-1, 1] };
        this._clientStore = new ClientStore();

        this._passthroughIo = new Server(httpServer, {
            path: PASSTHROUGH_WSAPI_PATH
        });
        this._clientIo = new Server(httpServer, {
            path: CLIENT_WSAPI_PATH
        });
        this._guiIo = new Server(httpServer, {
            path: GUI_WSAPI_PATH
        });

        this._passthroughIo.on('connection', async (socket: Socket) => {
            try {
                if (!this._pool) {
                    throw 'db not ready';
                }

                if (!socket.handshake.auth) {
                    throw 'invalid request';
                }

                let socketAuthObj = socket.handshake.auth as {token: string, twoFactor: string};

                let clientId = await this._clientAuth(socketAuthObj.token, socketAuthObj.twoFactor);
                if (!clientId) {
                    throw 'authentication failed';
                }

                await this._setupPassthroughSocket(clientId, socket);
            } catch (e) {
                socket.disconnect(true);
            }
        });
    
        this._clientIo.on('connection', async (socket: Socket) => {
            try {
                if (!this._pool) {
                    throw 'db not ready';
                }

                if (!socket.handshake.auth) {
                    throw 'invalid request';
                }

                let socketAuthObj = socket.handshake.auth as {token: string, twoFactor: string};

                let clientId = await this._clientAuth(socketAuthObj.token, socketAuthObj.twoFactor);
                if (!clientId) {
                    throw 'authentication failed';
                }

                await this._setupClientSocket(clientId, socket);
            } catch (e) {
                socket.disconnect(true);
            }
        });

        this._guiIo.on('connection', async (socket: Socket & LoginStatus) => {
            try {
                if (!this._pool) {
                    throw 'db not ready';
                }

                if (!socket.handshake.headers.cookie) {
                    throw 'invalid request';
                }

                let cookies = cookie.parse(socket.handshake.headers.cookie);
                let sessionStruct = await sessionController.getSessionStruct(
                    cookies[SESSION_NAME], 
                    socket.handshake.headers, 
                    socket.handshake.address
                )

                await loginController.getLoginStatus(socket, sessionStruct);

                if (!(socket.loginStatus?.loggedIn)) {
                    throw 'invalid request';
                }

                this._setupGuiSocket(socket);
            } catch (e) {
                socket.disconnect(true);
            }
        });
    }

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

    private async _setupClientSocket(clientId: string, socket: Socket) {
        if (this._clientStore.addClientSocketId(clientId, socket.id)) {
            // notify online
            this._broadcastToGui('online', [clientId], true);

            let guiCount = await this._getClientGuiCount(clientId);
            if (guiCount > 0) {
                this._sendMsgAck(socket, 'polling', [true], true);
            }

            let passthroughcount = await this._getClientPassthroughCount(clientId);
            if (passthroughcount > 0) {
                this._sendMsgAck(socket, 'passthrough', [true], true);
            }
        }

        socket.on('disconnect', () => {
            if (this._clientStore.removeClientSocketId(clientId, socket.id)) {
                // notify offline
                this._broadcastToGui('offline', [clientId], true);
            }
        });

        socket.on('log', async (logClientEncoded, ackResponse) => {
            if (ackResponse instanceof Function) {
                ackResponse(true);
            }

            if (!logClientEncoded) {
                return;
            }

            let spabLog = await this._clientStore.addLogEncoded(
                clientId,
                logClientEncoded
            );

            if (spabLog) {
                await this._sendToGuiSubscriber(clientId, 'log', [
                    this._clientStore.getLogGui(clientId, spabLog)
                ], false);
            }
        });

        socket.on('rawData', async (data: Buffer) => {
            await this._sendToPassthroughSubscriber(clientId, 'rawData', [data], false);
        });
    }

    private _setupPassthroughSocket(clientId: string, socket: Socket & PassthroughStatus) {
        socket.passthroughStatus = {
            clientId: clientId
        };

        socket.on('rawData', (data: Buffer) => {
            this._sendToClient(clientId, 'rawData', [data], false);
        });

        socket.on('disconnect', async (err: any) => {
            let count = await this._getClientPassthroughCount(clientId);
            if (count === 0) {
                this._sendToClient(clientId, 'passthrough', [false], true);
            }
        });

        if (this._clientStore.isClientExist(clientId)) {
            this._sendToClient(clientId, 'passthrough', [true], true);
        }
    }

    private _setupGuiSocket(socket: Socket & LoginStatus & GuiStatus) {
        socket.guiStatus = {
            subscribedClientIds: new Set<string>()
        }

        socket.on('get', (cmd: string, ackResponse) => {
            if (!(ackResponse instanceof Function)) {
                return;
            }

            if (cmd === 'clients') {
                ackResponse(this._clientStore.getClientList());
            }
        });

        socket.on('log', async (clientId: string, timestamp: number, ackResponse) => {
            if (!(ackResponse instanceof Function)) {
                return;
            }

            ackResponse(true);

            await this._sendLogs(clientId, timestamp, socket);
        });

        socket.on('subscribe', async (clientId: string, ackResponse) => {
            if (!(ackResponse instanceof Function)) {
                return;
            }

            ackResponse(true);

            if (this._clientStore.isClientExist(clientId)) {
                socket.guiStatus!.subscribedClientIds.add(clientId);
                await this._setClientPolling(clientId, true);
                await this._sendLogs(clientId, -1, socket);
            }
        });

        socket.on('unsubscribe', async (clientId: string, ackResponse) => {
            if (!(ackResponse instanceof Function)) {
                return;
            }

            ackResponse(true);

            if (this._clientStore.isClientExist(clientId)) {
                socket.guiStatus!.subscribedClientIds.delete(clientId);
                await this._setClientPolling(clientId, false);
            }
        });

        socket.on('unsubscribe', async (clientId: string, ackResponse) => {
            if (!(ackResponse instanceof Function)) {
                return;
            }

            ackResponse(true);

            if (this._clientStore.isClientExist(clientId)) {
                socket.guiStatus!.subscribedClientIds.delete(clientId);
                await this._setClientPolling(clientId, false);
            }
        });

        socket.on('unsubscribeAll', async (ackResponse) => {
            if (!(ackResponse instanceof Function)) {
                return;
            }

            ackResponse(true);

            await this._handleGuiUnsubscribeAll(socket);
        });


        socket.on('disconnect', async (err: any) => {
            await this._handleGuiUnsubscribeAll(socket);
        });
    }

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