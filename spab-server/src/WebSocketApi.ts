// import config file
import './Config';

import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";

import * as mongodb from 'mongodb'
import { authenticator, totp } from 'otplib';



export class WebSocketApi {

    private _db?: mongodb.Db;

    private _clientIo: Server;
    private _guiIo: Server;


    constructor(httpServer: http.Server) {

        totp.options = { window: [-1, 1] };
        
        this._clientIo = new Server(httpServer, {
            path: CLIENT_API_PATH
        });
        this._guiIo = new Server(httpServer, {
            path: GUI_API_PATH
        });
    
        this._clientIo.on("connection", async (socket: Socket) => {
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
                console.log(e);
                socket.disconnect(true);
            }
        });
    }

    private async _clientAuth(token: string, twoFactor: string): Promise<string | undefined> {
        let client = await this._db!.collection('client').findOne({
            token: token
        }, {
            projection: {
                _id: 1,
                two_factor: 1
            }
        });

        if (!client) {
            return;
        }

        let authenticated = false;

        if (client.two_factor?.type === 'totp' && client.two_factor?.secret) {
            authenticated = authenticator.verify({
                token: twoFactor, 
                secret: client.two_factor.secret
            });
        }

        if (authenticated) {
            return client._id.toString();
        }

        return;
    }

    private _setupClientSocket(clientId: string, socket: Socket) {
        console.log('connect');
        socket.emit('isPolling', true);

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
                    logFreq = 2 * 60 * 1000;
                } else if (log.type === 'sensor') {
                    logObj.obj = SpabDataStruct.SensorData.decode(logObj.data!);
                    logFreq = 1 * 60 * 1000;
                }

                delete logObj.data;

                // forcefully remove deleted properties
                logObj = {...logObj};

                let lastLogTimestamp = 0;
                if (!log?.id) {
                    lastLogTimestamp = (await this._db!.collection('log').findOne(lastLogDataFilter, {
                        projection: {
                            _id: 0,
                            timestamp: 1
                        }
                    }))?.timestamp ?? 0;
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
    }
}