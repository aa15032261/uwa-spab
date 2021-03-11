// import config file
import './Config';

import { CamControl } from "./CamControl";
import { io, Socket } from "socket.io-client";
import { LogClientDb } from './LogClientDb';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";

import { authenticator } from 'otplib';

interface Camera {
    name: string,
    camControl: CamControl
}

export class MainController {

    private _logClientDb: LogClientDb;

    private _socket: Socket;
    private _isPolling = false;

    private _syncTimer: NodeJS.Timeout | null = null;

    private _cameras: Camera[] = [];
    private _cameraTimer: NodeJS.Timeout | null = null;

    private _sensorTimer: NodeJS.Timeout | null = null;

    constructor() {
        this._logClientDb = new LogClientDb(LOG_DB_PATH, CLIENT_API_TOKEN);

        // init cameras
        for (let camCfg of CAM_CFGS) {
            let camera = {
                name: camCfg.name,
                camControl: new CamControl(camCfg.cfg),
            }

            camera.camControl.imgCallback = (buf: Buffer) => {
                this._handleNewCameraData(
                    camera.name,
                    {
                        buf: buf
                    }
                );
            }
            camera.camControl.imgInterval = -1;

            this._cameras.push(camera);
        }

        // init socket io
        this._socket = io(SERVER_URL, {
            path: CLIENT_API_PATH,
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
                    authObj.twoFactor = authenticator.generate(CLIENT_TWO_FACTOR.secret);
                }

                cb(authObj);
            }
        });

        this._socket.on('connect', () => {
            this._connectHandler();
        });
        this._socket.on('reconnect', () => {
            this._connectHandler();
        });
        this._socket.on('connect_error', (err: any) => {
            this._disconnectHandler(err);
        });
        this._socket.on('disconnect', (reason: string) => {
            this._disconnectHandler(reason);

            // reconnect in 30 seconds if kicked by the server
            setTimeout(() => {
                this._socket.connect();
            }, 30000);
        });

        this._socket.on('polling', (isPolling: boolean, ackResponse: any) => {
            console.log('polling');

            if (!(ackResponse instanceof Function)) {
                return;
            }

            ackResponse(true);

            this.isPolling = isPolling;
        });

        this._restartEventLoop();
    }

    private _connectHandler() {
        console.log('server connected');

        this._socket.sendBuffer = [];

        this._sync();

        this._restartEventLoop();
    }

    private _disconnectHandler(err: any) {
        console.log('server disconnected');
        this.isPolling = false;
    };

    private _restartEventLoop() {
        this._cameraLoop();
        this._sensorLoop();
    }


    set isPolling(isPolling: boolean) {
        if (this._isPolling !== isPolling) {

            this._isPolling = isPolling;

            for (let camera of this._cameras) {
                if (isPolling) {
                    camera.camControl.imgInterval = CAM_ONLINE_INTERVAL;
                } else {
                    camera.camControl.imgInterval = -1;
                }
            }

            this._restartEventLoop();
        }
    }

    private _checkOnline(): boolean {
        if (this._socket.connected) {
            return true;
        } else {
            this.isPolling = false;
            return false;
        }
    }

    private _handleNewCameraData(camName: string, camData: SpabDataStruct.ICameraData) {
        let data = Buffer.from(SpabDataStruct.CameraData.encode(camData).finish());
        this._handleNewData('camera', camName, data);
    }

    private _handleNewSensorData(snrName: string, snrData: SpabDataStruct.ISensorData) {
        let data = Buffer.from(SpabDataStruct.SensorData.encode(snrData).finish());
        this._handleNewData('sensor', snrName, data);
    }

    private _handleNewData(type: 'camera' | 'sensor', typeId: string, data: Buffer) {
        if (this._checkOnline()) {
            let log: SpabDataStruct.ILogClient = {
                type: type,
                typeId: typeId,
                data: data
            };
            this._sendMsgAck('log', [SpabDataStruct.LogClient.encode(log).finish()], false);
        } else {
            this._logClientDb.add(type, typeId, data);
        }
    }

    private _cameraLoop() {
        if (this._cameraTimer) {
            clearTimeout(this._cameraTimer);
        }

        let _timeout: number;
        if (this._isPolling) {
            _timeout = CAM_ONLINE_INTERVAL;
        } else {
            _timeout = CAM_OFFLINE_INTERVAL;
        }

        if (!this._isPolling) {
            for (let camera of this._cameras) {
                camera.camControl.takePicture();
            }
        }

        this._cameraTimer = setTimeout(() => {
            this._cameraLoop();
        }, _timeout);
    }

    private _sensorLoop() {
        if (this._sensorTimer) {
            clearTimeout(this._sensorTimer);
        }

        let _timeout: number;

        if (this._isPolling) {
            _timeout = SNR_ONLINE_INTERVAL;
        } else {
            _timeout = SNR_OFFLINE_INTERVAL;
        }

        //TODO:


        this._sensorTimer = setTimeout(() => {
            this._sensorLoop();
        }, _timeout);
    }



    private _sync() {
        if (!this._syncTimer) {
            this._syncTimer = setTimeout(async () => {
                await this._syncLoop();
            }, 1);
        }
    }

    private async _syncLoop() {
        try {
            while (1) {
                let log = await this._logClientDb.getFirst();

                if (log && this._checkOnline()) {
                    if (
                        (await this._sendMsgAck('log', [
                            SpabDataStruct.LogClient.encode(log!).finish()
                        ], true))
                    ) {
                        await this._logClientDb.remove(log.logId!, log.timestamp!, log.type!, log.typeId!);
                    } else {
                        throw 'network error';
                    }
                } else {
                    this._syncTimer = null;
                    this._logClientDb.vacuum();
                    break;
                }
            }
        } catch (e) {
            console.log(e);

            this._syncTimer = setTimeout(async () => {
                if (this._checkOnline()) {
                    await this._syncLoop();
                } else {
                    this._syncTimer = null;
                }
            }, 1000);
        }
    }

    private async _sendMsgAck(
        evt: string,
        values: any[],
        ack: boolean
    ): Promise<any> {
        if (ack) {
            for (let i = 0; i < 3; i++) {
                try {
                    return await this._sendMsgAckOnce(evt, values, (i + 1) * 10000);
                } catch (e) { };
            }
        } else {
            this._socket.emit(evt, ...values);
        }

        return;
    }

    private _sendMsgAckOnce(
        evt: string,
        values: any[],
        timeout: number
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                reject()
            }, timeout);

            this._socket.emit(evt, ...values, (res: any) => {
                resolve(res);
            });
        })
    }
}
