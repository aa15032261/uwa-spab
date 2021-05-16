// import config file
import './Config';

import { ArduPilotControl } from './ArduPilotControl';
import { CamControl } from './CamControl';
import { LogClientDb } from './LogClientDb';
import { SpabDataStruct } from './../../spab-data-struct/SpabDataStruct';

import { authenticator } from 'otplib';
import { io, Socket } from 'socket.io-client';

import * as resetDateCache from 'reset-date-cache';

interface Camera {
    name: string,
    camControl: CamControl
}

export class MainController {

    private _logClientDb: LogClientDb;

    private _socket: Socket;
    private _isPolling = false;
    private _isPassthrough = false;

    private _syncTimer: NodeJS.Timeout | null = null;

    private _apControl: ArduPilotControl;

    private _cameras: Camera[] = [];
    private _cameraTimer: NodeJS.Timeout | null = null;

    private _sensorTimer: NodeJS.Timeout | null = null;


    /**
     * MainController sends new data from CamControl and ArduPilotControl to the server.
     * The data is cached locally if internet is unavailable.
     */
    constructor() {
        this._logClientDb = new LogClientDb(LOG_DB_PATH, CLIENT_API_TOKEN);

        // Initialises ArduPilotControl
        this._apControl = new ArduPilotControl(
            ARDUPILOT_COM_PATH,
            ARDUPILOT_COM_BAUD
        );
        this._apControl.msgCallback = (msgType, msg) => {
            this._handleNewSensorData(
                msgType,
                Buffer.from(JSON.stringify(msg))
            );
        };
        this._apControl.dataCallback = (data) => {
            this._handleNewRawData(data);
        }

        // Initialises CamControl
        for (let camCfg of CAM_CFGS) {
            let camera = {
                name: camCfg.name,
                camControl: new CamControl(camCfg.cfg),
            }

            camera.camControl.imgCallback = (buf: Buffer) => {
                this._handleNewCameraData(
                    camera.name,
                    buf
                );
            }
            camera.camControl.imgInterval = -1;

            this._cameras.push(camera);
        }

        // Intialises server connection
        this._socket = io(SERVER_URL, {
            path: CLIENT_WSAPI_PATH,
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
            // Reconnects in 30 seconds if kicked by the server
            this._disconnectHandler(reason);
            setTimeout(() => {
                // forces nodejs to get current system time
                // as the login depends on totp
                (resetDateCache as () => void)();

                this._socket.connect();
            }, 30000);
        });

        this._socket.on('polling', (isPolling: boolean, ackResponse: any) => {
            console.log('polling');

            // Ack response
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);

            this.isPolling = isPolling;
        });

        this._socket.on('passthrough', (isPassthrough: boolean, ackResponse: any) => {
            console.log('passthrough');

            // Ack response
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);

            this.isPassthrough = isPassthrough;
        });

        // Sends mavlink raw data from passthrough socket to ardupilot
        this._socket.on('rawData', (data: Buffer) => {
            this._apControl.sendRawData(data);
        });

        // Restarts event loop
        this._restartEventLoop();
    }


    /**
     * Handles server connect event
     */
    private _connectHandler() {
        console.log('server connected');

        // Clears send buffer
        this._socket.sendBuffer = [];

        // Synchronises log cache with the server
        this._sync();

        // Restarts event loop
        this._restartEventLoop();
    }

    /**
     * Handles server disconnect event
     */
    private _disconnectHandler(err: any) {
        console.log('server disconnected');

        // Disables polling and passthrough mode
        this.isPolling = false;
        this.isPassthrough = false;
    };

    /**
     * Restarts event loop
     */
    private _restartEventLoop() {
        this._cameraLoop();
        this._sensorLoop();
    }

    /**
     * Updates polling mode
     */
    set isPolling(isPolling: boolean) {
        if (this._isPolling !== isPolling) {

            this._isPolling = isPolling;

            // Updates data interval based on current polling mode
            // 
            // NOTES: 
            // While the app is in polling mode, imgInterval is set to a positive number and
            // CamControl creates a background process to feed camera stream to the app, 
            // which allows the app to get the camera stream much quicker but 
            // it consumes more power since the camera stays on.
            //
            // Therefore, the app use a timer (the _cameraLoop function) to 
            // get camera stream periodically if polling mode is off.
            for (let camera of this._cameras) {
                if (isPolling) {
                    camera.camControl.imgInterval = CAM_ONLINE_INTERVAL;
                } else {
                    camera.camControl.imgInterval = -1;
                }
            }

            if (this._isPolling) {
                this._apControl.msgInterval = SNR_ONLINE_INTERVAL;
            } else {
                this._apControl.msgInterval = SNR_OFFLINE_INTERVAL;
            }

            // Restarts event loop
            this._restartEventLoop();
        }
    }

    /**
     * Updates passthrough mode
     */
    set isPassthrough(isPassthrough: boolean) {
        this._isPassthrough = isPassthrough;
    }

    /**
     * Checks if the client is connected to the server
     * @returns {boolean} - True if the client is connected to the server, otherwise, false
     */
    private _checkOnline(): boolean {
        if (this._socket.connected) {
            return true;
        } else {
            this.isPolling = false;
            this.isPassthrough = false;
            return false;
        }
    }

    /**
     * Handles new camera data
     * 
     * @param {string} camName - Camera name
     * @param {Buffer} camData - Camera data
     */
    private _handleNewCameraData(camName: string, camData: Buffer) {
        this._handleNewLog('camera', camName, camData);
    }

    /**
     * Handles new sensor data
     * 
     * @param {string} snrName - Sensor name
     * @param {Buffer} snrData - Sensor data
     */
    private _handleNewSensorData(snrName: string, snrData: Buffer) {
        this._handleNewLog('sensor', snrName, snrData);
    }

    /**
     * Handles new mavlink data
     * 
     * @param {Buffer} data - Sensor data
     */
    private _handleNewRawData(data: Buffer) {
        if (this._isPassthrough) {
            this._socket.emit('rawData', data);
        }
    }


    /**
     * Handles new logs
     * 
     * If the client is connected to the server, the function sends the log to the server directly.
     * Otherwise, the log is saved to the local cache.
     * 
     * @param {'camera' | 'sensor'} type - Log type
     * @param {string} typeId - Log type id
     * @param {Buffer} data - Log data
     */
    private _handleNewLog(type: 'camera' | 'sensor', typeId: string, data: Buffer) {
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


    /**
     * Camera data event loop. All camera related tasks should be handled here.
     */
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

    /**
     * Sensor data event loop. All sensor related tasks should be handled here.
     */
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

        //TODO: Other sensor controls

        this._sensorTimer = setTimeout(() => {
            this._sensorLoop();
        }, _timeout);
    }

    /**
     * Start log synchronisation
     */
    private _sync() {
        // Runs only when synchronisation isnt running
        if (!this._syncTimer) {
            this._syncTimer = setTimeout(async () => {
                await this._syncLoop();
            }, 1);
        }
    }

    /**
     * Log synchronisation loop
     * 
     * The synchronisation loop will stop if all logs in the cache are sent to the server.
     */
    private async _syncLoop() {
        try {
            while (1) {
                // Get the first log
                let log = await this._logClientDb.getFirst();

                // Checks if the client is connected to the server
                if (log && this._checkOnline()) {
                    // Encodes the log and sends it to the server
                    if (
                        (await this._sendMsgAck('log', [
                            SpabDataStruct.LogClient.encode(log!).finish()
                        ], true))
                    ) {
                        // The log is successfully sent to the server, removes the log from the cache.
                        await this._logClientDb.remove(log.logId!, log.timestamp!, log.type!, log.typeId!);
                    } else {
                        throw 'network error';
                    }
                } else {
                    // Synchronisation completed
                    this._syncTimer = null;
                    // Removes deleted data from database permanently
                    this._logClientDb.vacuum();
                    break;
                }
            }
        } catch (e) {
            console.log(e);

            // Error occured, retries in 3 seconds
            this._syncTimer = setTimeout(async () => {
                if (this._checkOnline()) {
                    await this._syncLoop();
                } else {
                    this._syncTimer = null;
                }
            }, 3000);
        }
    }

    /**
     * Send an event to the server
     * 
     * @param {string} evt - Event type
     * @param {any[]} val - Event parameters
     * @param {boolean} ack - True if the message requires an ack response, otherwise, false.
     * @returns {Promise<any>} - Return response if the operation is succussful, otherwise, undefined
     */
    private async _sendMsgAck(
        evt: string,
        val: any[],
        ack: boolean
    ): Promise<any> {
        if (ack) {
            for (let i = 0; i < 3; i++) {
                try {
                    return await this._sendMsgAckOnce(evt, val, (i + 1) * 10000);
                } catch (e) { };
            }
        } else {
            this._socket.emit(evt, ...val);
        }

        return;
    }

    /**
     * Send an event to the server once
     * 
     * @param {string} evt - Event type
     * @param {any[]} val - Event parameters
     * @param {number} timeout - Timeout for the operation
     * @returns {Promise<any>} - Return response if the operation is succussful, otherwise, undefined
     */
    private _sendMsgAckOnce(
        evt: string,
        val: any[],
        timeout: number
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                reject('timeout')
            }, timeout);

            this._socket.emit(evt, ...val, (res: any) => {
                resolve(res);
            });
        })
    }
}
