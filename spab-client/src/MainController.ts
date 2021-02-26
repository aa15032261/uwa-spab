// import config file
import './Config';

import { CamControl } from "./CamControl";
import { io, Socket } from "socket.io-client";
import { LogDb } from './LogDb';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";
import { stringify } from 'querystring';

interface Camera {
    name: string, 
    camControl: CamControl
}

export class MainController {

    private _logDb: LogDb;

    private _socket: Socket;
    private _isOnline = false;

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
        if (this._socket.connected) {
            this._socket.emit('camData', {
                timestamp: (new Date()).getTime(),
                data: camData
            });
        } else {
            this._logDb.add('camera', camData);
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
}

