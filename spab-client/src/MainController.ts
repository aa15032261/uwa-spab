// import config file
import './Config';

import { CamControl } from "./CamControl";
import { io, Socket } from "socket.io-client";
import { LogDb } from './LogDb';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";

interface Camera {
    name: string, 
    camControl: CamControl
}

export class MainController {

    private _logDb: LogDb;

    private _socket: Socket;
    private _isOnline = false;

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
                camControl: new CamControl(camCfg.cfg, '5'),
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
            auth: {
                token: CLIENT_API_TOKEN
            },
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

        this._restartEventLoop();
    }

    private _connectHandler() {
        console.log('server connected');

        this._socket.sendBuffer = [];

        this._sync();
        
        this._restartEventLoop();

        this._socket.on('isOnline', (isOnline: boolean) => {
            this.isOnline = isOnline;
        });
    }

    private _disconnectHandler(err: any) {
        console.log('server disconnected');
        this.isOnline = false;
    };

    private _restartEventLoop() {
        this._cameraLoop();
        this._sensorLoop();
    }


    set isOnline(isOnline: boolean) {
        if (this._isOnline !== isOnline) {

            this._isOnline = isOnline;

            for (let camera of this._cameras) {
                if (isOnline) {
                    camera.camControl.imgInterval = CAM_ONLINE_INTERVAL;
                } else {
                    camera.camControl.imgInterval = -1;
                }
            }
    
            this._restartEventLoop();
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
        if (this._socket.connected) {
            let log: SpabDataStruct.ILog = {
                timestamp: (new Date()).getTime(),
                type: type,
                data: data
            };
            this._socket.emit('log', log);
        } else {
            this._logDb.add(type, data);
        }
    }

    private _cameraLoop() {
        console.log('cam loop');
        if (this._cameraTimer) {
            clearTimeout(this._cameraTimer);
        }

        let _timeout: number;
        if (this._isOnline) {
            _timeout = CAM_ONLINE_INTERVAL;
        } else {
            _timeout = CAM_OFFLINE_INTERVAL;
        }

        if (!this._isOnline) {
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

        if (this._isOnline) {
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
                await this._syncOne();
            }, 1);
        }
    }

    private async _syncOne() {
        try {
            while (1) {
                let log = await this._logDb.getFirst();

                if (log && this._socket.connected) {

                    await (new Promise((resolve, reject) => {
                        let _timer = setTimeout(() => {
                            reject('sync timeout');
                        }, 30000);

                        this._socket.emit('data', log, (ack: boolean) => {
                            clearTimeout(_timer);

                            this._logDb.remove(
                                log!.id,
                                log!.timestamp,
                                log!.type
                            );

                            resolve(undefined);
                        });
                    }));

                } else {
                    this._syncTimer = null;
                    break;
                }
            }
        } catch (e) {
            console.log(e);

            this._syncTimer = setTimeout(async () => {
                if (this._socket.connected) {
                    await this._syncOne();
                } else {
                    this._syncTimer = null;
                }
            }, 5000);
        }
    }
}
