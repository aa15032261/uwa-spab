// import config file
import './Config';

import * as http from 'http';
import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";

import * as mongodb from 'mongodb'
import { authenticator, totp } from 'otplib';
import { SessionController } from './SessionController';
import { LoginController, LoginStatus } from './LoginController';
import { ClientStore, SpabLog } from './ClientStore';

interface GuiStatus {
    guiStatus?: {
        subscribedClientIds: Set<string>
    }
}

export class WebSocketApi {

    private _db?: mongodb.Db;

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
        
        this._clientIo = new Server(httpServer, {
            path: CLIENT_API_PATH
        });
        this._guiIo = new Server(httpServer, {
            path: GUI_API_PATH
        });
    
        this._clientIo.on('connection', async (socket: Socket) => {
            console.log('client');
            try {
                if (!this._db) {
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
                if (!this._db) {
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
                console.log(e);
                socket.disconnect(true);
            }
        });
    }

    private async _clientAuth(token: string, twoFactor: string): Promise<string | undefined> {
        let clientObj = await this._db!.collection('client').findOne({
            token: token
        }, {
            projection: {
                _id: 1,
                name: 1,
                two_factor: 1
            }
        });

        if (!clientObj) {
            return;
        }

        let authenticated = false;

        if (clientObj.two_factor?.type === 'totp' && clientObj.two_factor?.secret) {
            authenticated = authenticator.verify({
                token: twoFactor, 
                secret: clientObj.two_factor.secret
            });
        }

        if (authenticated) {
            return clientObj._id.toString();
        }

        await this._clientStore.createClient(
            clientObj._id.toString(),
            clientObj.name
        );
        
        return;
    }

    private async _setupClientSocket(clientId: string, socket: Socket) {
        console.log('connect');

        if (this._clientStore.addClientSocketId(clientId, socket.id)) {
            // notify online
            this._broadcastToGui('online', clientId);

            let count = await this._getClientSubscriberCount(clientId);
            if (count > 0) {
                this._sendMsgAck(socket, 'polling', [true]);
            }
        }

        socket.on('disconnect', () => {
            if (this._clientStore.removeClientSocketId(clientId, socket.id)) {
                // notify offline
                this._broadcastToGui('offline', clientId);
            }
        });

        socket.on('log', async (ackResponse, logEncoded) => {
    
            if (ackResponse instanceof Function) {
                ackResponse(true);
            } else {
                return;
            }

            if (!logEncoded) {
                return;
            }

            let log: SpabDataStruct.ILog | undefined;

            try {
                log = SpabDataStruct.Log.decode(new Uint8Array(logEncoded));
            } catch (e) {}

            if (!log) {
                return;
            }

            if (log.id) {
                // cached data

                // invalid timestamp
                if (log.timestamp! > (new Date()).getTime()) {
                    return;
                }

                // check if the cached log is in the database
                let existingLog = await this._db!.collection('log').findOne({
                    id: log.id,
                    timestamp: log.timestamp,
                    type: log.type
                }, {
                    projection: {
                        _id: 1,
                        two_factor: 1
                    }
                });

                if (existingLog) {
                    return;
                }
            } else {
                // real time data
                log.timestamp = (new Date()).getTime();
                delete log.id;
            }


            try {
                let logObj: SpabDataStruct.ILog & {clientId?: mongodb.ObjectId, obj?: any} = log;
                logObj.clientId = new mongodb.ObjectId(clientId);

                let lastLogDataFilter: any = {
                    clientId: logObj.clientId,
                    type: log.type
                };
                let logFreq = 60 * 1000;

                if (log.type === 'camera') {
                    logObj.obj = SpabDataStruct.CameraData.decode(logObj.data!);
                    logObj.obj.buf = Buffer.from(logObj.obj.buf);
                    lastLogDataFilter["obj.name"] = logObj.obj.name;
                    logFreq = 60 * 1000;
                } else if (log.type === 'sensor') {
                    logObj.obj = SpabDataStruct.SensorData.decode(logObj.data!);
                    logFreq = 30 * 1000;
                }

                delete logObj.data;

                // forcefully remove deleted properties
                logObj = {...logObj};

                let lastLogTimestamp = 0;
                if (!log?.id) {
                    // find last log's timestamp
                    lastLogTimestamp = (await this._db!.collection('log').find(
                        lastLogDataFilter, 
                        {
                            projection: {
                                _id: 0,
                                timestamp: 1
                            }
                        }
                    )
                    .sort({'timestamp': -1})
                    .limit(1)
                    .toArray())[0]?.timestamp ?? 0;
                }

                if (logObj.timestamp! - lastLogTimestamp > logFreq) {
                    await this._db!.collection('log').insertOne(logObj);
                }


                let spabLog = this._clientStore.addLog(log);
                if (!spabLog) {
                    return;
                }

                await this._sendToGuiSubscriber(clientId, 'log', {
                    clientId,
                    ...spabLog
                });
            } catch (e) {
                console.log(e);
            }
        });
    }

    private _setupGuiSocket(socket: Socket & LoginStatus & GuiStatus) {
        socket.guiStatus = {
            subscribedClientIds: new Set<string>()
        }

        socket.on('get', (ackResponse, cmd: string) => {
            if (!(ackResponse instanceof Function)) {
                return;
            }

            if (cmd === 'clients') {
                ackResponse(this._clientStore.getClientList());
            }
        });

        socket.on('log', async (clientId: string) => {
            await this._sendLatestLog(clientId, socket);
        });

        socket.on('subscribe', async (ackResponse, clientId: string) => {
            if (!(ackResponse instanceof Function)) {
                return;
            }

            ackResponse(true);

            if (this._clientStore.isClientExist(clientId)) {
                socket.guiStatus!.subscribedClientIds.add(clientId);
                await this._setClientPolling(clientId, true);
                await this._sendLatestLog(clientId, socket);
            }
        });

        socket.on('unsubscribe', async (ackResponse, clientId: string) => {
            if (!(ackResponse instanceof Function)) {
                return;
            }

            ackResponse(true);

            if (this._clientStore.isClientExist(clientId)) {
                socket.guiStatus!.subscribedClientIds.delete(clientId);
                await this._setClientPolling(clientId, false);
            }
        });

        socket.on('unsubscribe', async (ackResponse, clientId: string) => {
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

            await this._handleUnsubscribeAll(socket);
        });


        socket.on('disconnect', async (err: any) => {
            await this._handleUnsubscribeAll(socket);
        });
    }

    private async _handleUnsubscribeAll(
        socket: Socket & LoginStatus & GuiStatus
    ) {
        if (socket.guiStatus) {
            for (let clientId of socket.guiStatus.subscribedClientIds) {
                socket.guiStatus!.subscribedClientIds.delete(clientId);
                await this._setClientPolling(clientId, false);
            }
        }
    }


    private async _sendLatestLog(
        clientId: string,
        socket: Socket
    ) {
        let client = this._clientStore.getClient(clientId);

        if (!client) {
            return;
        }

        for (let spabLog of client.latestLogs) {
            this._sendMsgAck(socket, 'log', [{
                clientId,
                ...spabLog
            }]);
        }
    }


    private async _getClientSubscriberCount(clientId: string): Promise<number> {
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

    private async _setClientPolling (
        clientId: string,
        isPolling: boolean
    ): Promise<any>  {

        if (this._clientStore.getSocketIdCount(clientId) <= 0) {
            return;
        }

        let count = await this._getClientSubscriberCount(clientId);

        if (
            (count === 1 && isPolling === true) ||
            (count === 0 && isPolling === false)
        ) {
            this._sendToClient(clientId, 'polling', isPolling);
        }
    }

    private _sendToClient (
        clientId: string,
        evt: string, 
        val: any
    ) {
        let client = this._clientStore.getClient(clientId);
        if (client) {

            for (let socketId of client.socketIds) {
                let socket = this._clientIo.sockets.sockets.get(socketId);

                if (socket) {
                    this._sendMsgAck(socket, evt, val);
                }
            }
        }
    }

    private async _sendToGuiSubscriber(
        clientId: string,
        evt: string, 
        val: any
    ) {
        console.log(val);
        for (let [socketId, socket] of await this._guiIo.sockets.sockets) {
            try {
                let guiSocket = socket as Socket & LoginStatus & GuiStatus;
                if (guiSocket.loginStatus?.loggedIn) {
                    if (guiSocket.guiStatus!.subscribedClientIds.has(clientId)) {
                        this._sendMsgAck(socket, evt, val);
                    }
                }
            } catch (e) {}
        }
    }

    private async _broadcastToGui(
        evt: string, 
        val: any
    ): Promise<any>  {
        for (let [socketId, socket] of await this._guiIo.sockets.sockets) {
            let guiSocket = socket as Socket & LoginStatus;
            if (guiSocket.loginStatus?.loggedIn) {
                this._sendMsgAck(guiSocket, evt, val);
            }
        }
    }

    private async _sendMsgAck(
        socket: Socket, 
        evt: string, 
        values: any[],
    ): Promise<any> {
        for (let i = 0; i < 3; i++) {
            try {
                return await this._sendMsgAckOnce(socket, evt, values, (i + 1) * 10000);
            } catch (e) { };
        }
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

            socket.emit(evt, (res: any) => {
                resolve(res);
            }, ...values);
        })
    }


    public updateDbPool(db: mongodb.Db) {
        this._db = db;
        this._clientStore.updateDbPool(db);
    }
    
}