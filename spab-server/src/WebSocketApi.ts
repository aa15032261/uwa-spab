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

interface SpabClient {
    clientId: string,
    name: string,
    socketIds: Set<string>,
    latestLogs: {
        type: 'camera' | 'sensor',
        timestamp: number,
        obj: any
    }[]
}

export class WebSocketApi {

    private _db?: mongodb.Db;

    private _clientIo: Server;
    private _guiIo: Server;

    private _clientCache = new Map<string, SpabClient>();


    constructor(
        httpServer: http.Server, 
        sessionController: SessionController,
        loginController: LoginController
    ) {

        totp.options = { window: [-1, 1] };
        
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


                this._setupClientSocket(clientId, socket);

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
            } catch (e) {
                console.log(e);
                console.log(socket.handshake);
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

        await this._addNewClientToCache(
            clientObj._id.toString(),
            clientObj.name
        );
        return;
    }

    private _setupClientSocket(clientId: string, socket: Socket) {
        console.log('connect');

        //TODO: properly handle polling
        socket.emit('isPolling', true);

        let client = this._clientCache.get(clientId);
        if (client) {
            client.socketIds.add(socket.id);
            // TODO: notify online
        }

        socket.on('disconnect', () => {
            let client = this._clientCache.get(clientId);
            if (client) {
                client.socketIds.delete(socket.id);
                // TODO: notify offline
            }
        });

        socket.on('log', async (logEncoded, ackCallback) => {
    
            if (ackCallback) {
                ackCallback(true);
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
                let logObj: SpabDataStruct.ILog & {clientId?: string, obj?: any} = log;
                let lastLogDataFilter: any = {
                    clientId: clientId,
                    type: log.type
                };
                let logFreq = 60 * 1000;

                logObj.clientId = clientId;

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

                // TODO: add to clientCache

                let lastLogTimestamp = 0;
                if (!log?.id) {
                    // find last log's timestamp
                    lastLogTimestamp = (await this._db!.collection('log').find(lastLogDataFilter, {
                            projection: {
                                _id: 0,
                                timestamp: 1
                            }
                        })
                        .sort({'timestamp': -1})
                        .limit(1)
                        .toArray())[0]?.timestamp ?? 0;
                }

                if (logObj.timestamp! - lastLogTimestamp > logFreq) {
                    await this._db!.collection('log').insertOne(logObj);
                }

                this._guiIo.emit('log', log);
            } catch (e) {
                console.log(e);
            }
        });
    }

    public updateDbPool(db: mongodb.Db) {
        this._db = db;
        this._updateClientList();
    }

    private async _updateClientList() {
        try {
            let newClientIdSet = new Set<string>();
            let existingClientIdSet = new Set<string>();

            let clientObjs = await this._db!.collection('client').find({

            }, {
                projection: {
                    _id: 1,
                    name: 1
                }
            }).toArray();

            for (let clientObj of clientObjs) {
                clientObj.clientId = clientObj._id.toString();
                newClientIdSet.add(clientObj._id.toString());
            }

            // remove deleted clients from the list
            for (let [clientId, client] of this._clientCache) {
                if (newClientIdSet.has(client.clientId)) {
                    existingClientIdSet.add(clientId);
                } else {
                    this._clientCache.delete(clientId);
                }
            }



            // add new clients to the list
            for (let clientObj of clientObjs) {
                if (!existingClientIdSet.has(clientObj.clientId)) {
                    await this._addNewClientToCache(clientObj.clientId, clientObj.name);
                }
            }
            
        } catch (e) { }
    }

    private async _addNewClientToCache(
        clientId: string,
        name: string
    ) {
        if (!this._clientCache.has(clientId)) {
            let client = {
                clientId: clientId,
                name: name,
                socketIds: new Set<string>(),
                latestLogs: []
            };

            // TODO: populate object


            this._clientCache.set(clientId, client);
        }
    }
}