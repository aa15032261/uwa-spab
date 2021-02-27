// import config file
import './Config';

import { CamControl } from "./CamControl";
import { io, Socket } from "socket.io-client";
import { LogDb } from './LogDb';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";

import { authenticator } from 'otplib';

interface Camera {
    name: string, 
    camControl: CamControl
}

export class MainController {

    private _logDb: LogDb;

    private _socket: Socket;
    private _isPolling = false;

    private _syncTimer: NodeJS.Timeout | null = null;

    private _cameras: Camera[] = [];
    private _cameraTimer: NodeJS.Timeout | null = null;

    private _sensorTimer: NodeJS.Timeout | null = null;

    constructor () {
        this._logDb = new LogDb(LOG_DB_PATH, CLIENT_API_TOKEN);

        // init cameras
        for (let camCfg of CAM_CFGS) {
            let camera = {
                name: camCfg.name,
                camControl: new CamControl(camCfg.cfg),
            }
    
            camera.camControl.imgCallback = (buf: Buffer) => {
                this._handleNewCameraData({
                    name: camera.name, 
                    buf: buf
                });
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

        this._restartEventLoop();
    }

    private _connectHandler() {
        console.log('server connected');

        this._socket.sendBuffer = [];

        this._sync();
        
        this._restartEventLoop();

        this._socket.on('isPolling', (isPolling: boolean) => {
            this.isPolling = isPolling;
        });
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

    private _handleNewCameraData(camData: SpabDataStruct.ICameraData) {
        let data = Buffer.from(SpabDataStruct.CameraData.encode(camData).finish());
        this._handleNewData('camera', data);
    }

    private _handleNewSensorData(snrData: SpabDataStruct.ISensorData) {
        let data = Buffer.from(SpabDataStruct.SensorData.encode(snrData).finish());
        this._handleNewData('sensor', data);
    }

    private _handleNewData(type: 'camera' | 'sensor', data: Buffer) {
        if (this._checkOnline()) {
            let log: SpabDataStruct.ILog = {
                type: type,
                data: data
            };
            this._socket.emit('log', SpabDataStruct.Log.encode(log).finish());
        } else {
            this._logDb.add(type, data);
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
                let log = await this._logDb.getFirst();

                if (log && this._checkOnline()) {
                    await (new Promise((resolve, reject) => {
                        let _timer = setTimeout(() => {
                            reject('sync timeout');
                        }, 30000);

                        this._socket.emit(
                            'log',
                            SpabDataStruct.Log.encode(log!).finish(),
                            (ack: boolean) => {
                                clearTimeout(_timer);

                                this._logDb.remove(
                                    log!.id!,
                                    log!.timestamp!,
                                    log!.type!
                                );

                                resolve(undefined);
                            }
                        );
                    }));
                } else {
                    this._syncTimer = null;
                    this._logDb.vacuum();
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
}
