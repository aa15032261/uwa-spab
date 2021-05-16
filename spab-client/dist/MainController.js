"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
const tslib_1 = require("tslib");
// import config file
require("./Config");
const ArduPilotControl_1 = require("./ArduPilotControl");
const CamControl_1 = require("./CamControl");
const LogClientDb_1 = require("./LogClientDb");
const SpabDataStruct_1 = require("./../../spab-data-struct/SpabDataStruct");
const otplib_1 = require("otplib");
const socket_io_client_1 = require("socket.io-client");
const resetDateCache = require("reset-date-cache");
class MainController {
    constructor() {
        this._isPolling = false;
        this._isPassthrough = false;
        this._syncTimer = null;
        this._cameras = [];
        this._cameraTimer = null;
        this._sensorTimer = null;
        this._logClientDb = new LogClientDb_1.LogClientDb(LOG_DB_PATH, CLIENT_API_TOKEN);
        //init ArduPilot Controller
        this._apControl = new ArduPilotControl_1.ArduPilotControl(ARDUPILOT_COM_PATH, ARDUPILOT_COM_BAUD);
        this._apControl.msgCallback = (msgType, msg) => {
            this._handleNewSensorData(msgType, Buffer.from(JSON.stringify(msg)));
        };
        this._apControl.dataCallback = (data) => {
            this._handleNewRawData(data);
        };
        // init cameras
        for (let camCfg of CAM_CFGS) {
            let camera = {
                name: camCfg.name,
                camControl: new CamControl_1.CamControl(camCfg.cfg),
            };
            camera.camControl.imgCallback = (buf) => {
                this._handleNewCameraData(camera.name, buf);
            };
            camera.camControl.imgInterval = -1;
            this._cameras.push(camera);
        }
        // init socket io
        this._socket = socket_io_client_1.io(SERVER_URL, {
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
                    authObj.twoFactor = otplib_1.authenticator.generate(CLIENT_TWO_FACTOR.secret);
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
        this._socket.on('connect_error', (err) => {
            this._disconnectHandler(err);
        });
        this._socket.on('disconnect', (reason) => {
            this._disconnectHandler(reason);
            // reconnect in 30 seconds if kicked by the server
            setTimeout(() => {
                // forces nodejs to get current system time
                // as the login depends on totp
                resetDateCache();
                this._socket.connect();
            }, 30000);
        });
        this._socket.on('polling', (isPolling, ackResponse) => {
            console.log('polling');
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);
            this.isPolling = isPolling;
        });
        this._socket.on('passthrough', (isPassthrough, ackResponse) => {
            console.log('passthrough');
            if (!(ackResponse instanceof Function)) {
                return;
            }
            ackResponse(true);
            this.isPassthrough = isPassthrough;
        });
        this._socket.on('rawData', (data) => {
            this._apControl.sendRawData(data);
        });
        this._restartEventLoop();
    }
    _connectHandler() {
        console.log('server connected');
        this._socket.sendBuffer = [];
        this._sync();
        this._restartEventLoop();
    }
    _disconnectHandler(err) {
        console.log('server disconnected');
        this.isPolling = false;
    }
    ;
    _restartEventLoop() {
        this._cameraLoop();
        this._sensorLoop();
    }
    set isPolling(isPolling) {
        if (this._isPolling !== isPolling) {
            this._isPolling = isPolling;
            for (let camera of this._cameras) {
                if (isPolling) {
                    camera.camControl.imgInterval = CAM_ONLINE_INTERVAL;
                }
                else {
                    camera.camControl.imgInterval = -1;
                }
            }
            if (this._isPolling) {
                this._apControl.msgInterval = SNR_ONLINE_INTERVAL;
            }
            else {
                this._apControl.msgInterval = SNR_OFFLINE_INTERVAL;
            }
            this._restartEventLoop();
        }
    }
    set isPassthrough(isPassthrough) {
        this._isPassthrough = isPassthrough;
    }
    _checkOnline() {
        if (this._socket.connected) {
            return true;
        }
        else {
            this.isPolling = false;
            this.isPassthrough = false;
            return false;
        }
    }
    _handleNewCameraData(camName, camData) {
        console.log('b');
        this._handleNewData('camera', camName, camData);
    }
    _handleNewSensorData(snrName, snrData) {
        console.log('a');
        this._handleNewData('sensor', snrName, snrData);
    }
    _handleNewRawData(data) {
        if (this._isPassthrough) {
            this._socket.emit('rawData', data);
        }
    }
    _handleNewData(type, typeId, data) {
        if (this._checkOnline()) {
            let log = {
                type: type,
                typeId: typeId,
                data: data
            };
            this._sendMsgAck('log', [SpabDataStruct_1.SpabDataStruct.LogClient.encode(log).finish()], false);
        }
        else {
            this._logClientDb.add(type, typeId, data);
        }
    }
    _cameraLoop() {
        if (this._cameraTimer) {
            clearTimeout(this._cameraTimer);
        }
        let _timeout;
        if (this._isPolling) {
            _timeout = CAM_ONLINE_INTERVAL;
        }
        else {
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
    _sensorLoop() {
        if (this._sensorTimer) {
            clearTimeout(this._sensorTimer);
        }
        let _timeout;
        if (this._isPolling) {
            _timeout = SNR_ONLINE_INTERVAL;
        }
        else {
            _timeout = SNR_OFFLINE_INTERVAL;
        }
        //TODO: Other sensor controls
        this._sensorTimer = setTimeout(() => {
            this._sensorLoop();
        }, _timeout);
    }
    _sync() {
        if (!this._syncTimer) {
            this._syncTimer = setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield this._syncLoop();
            }), 1);
        }
    }
    _syncLoop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                while (1) {
                    let log = yield this._logClientDb.getFirst();
                    if (log && this._checkOnline()) {
                        if ((yield this._sendMsgAck('log', [
                            SpabDataStruct_1.SpabDataStruct.LogClient.encode(log).finish()
                        ], true))) {
                            yield this._logClientDb.remove(log.logId, log.timestamp, log.type, log.typeId);
                        }
                        else {
                            throw 'network error';
                        }
                    }
                    else {
                        this._syncTimer = null;
                        this._logClientDb.vacuum();
                        break;
                    }
                }
            }
            catch (e) {
                console.log(e);
                this._syncTimer = setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (this._checkOnline()) {
                        yield this._syncLoop();
                    }
                    else {
                        this._syncTimer = null;
                    }
                }), 1000);
            }
        });
    }
    _sendMsgAck(evt, values, ack) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (ack) {
                for (let i = 0; i < 3; i++) {
                    try {
                        return yield this._sendMsgAckOnce(evt, values, (i + 1) * 10000);
                    }
                    catch (e) { }
                    ;
                }
            }
            else {
                this._socket.emit(evt, ...values);
            }
            return;
        });
    }
    _sendMsgAckOnce(evt, values, timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject();
            }, timeout);
            this._socket.emit(evt, ...values, (res) => {
                resolve(res);
            });
        });
    }
}
exports.MainController = MainController;
