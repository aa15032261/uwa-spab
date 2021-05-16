"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArduPilotControl = void 0;
const tslib_1 = require("tslib");
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
const message_registry_1 = require("./Mavlink2MsgRegistry/ArduPilot/message-registry");
const Serialport = require("serialport");
// python3 -m pymavlink.tools.mavgen --lang=TypeScript --wire-protocol=2.0 /Users/tomchan/opt/anaconda3/lib/python3.8/site-packages/pymavlink/message_definitions/v1.0/ardupilotmega.xml -o ~/test
const command_long_1 = require("./Mavlink2MsgRegistry/ArduPilot/messages/command-long");
const mav_component_1 = require("./Mavlink2MsgRegistry/ArduPilot/enums/mav-component");
const mav_cmd_1 = require("./Mavlink2MsgRegistry/ArduPilot/enums/mav-cmd");
const GLOBAL_POSITION_INT = 33;
class ArduPilotControl {
    constructor(comName, baudRate) {
        this._msgInterval = -1;
        this._msgMap = new Map();
        this._apMavlinkLastTimestamp = 0;
        this._comName = '';
        this._baudRate = 57600;
        this._comName = comName;
        this._baudRate = baudRate;
        this._initComPort();
    }
    _copyFields(obj, fields) {
        let newObj = {};
        for (let field of fields) {
            newObj[field] = obj[field];
        }
        return newObj;
    }
    _notifyArduPilot() {
        if (this._sp && this._sp.isOpen) {
            let protocolVer = new command_long_1.CommandLong(mav_component_1.MavComponent.MAV_COMP_ID_AUTOPILOT1, mav_component_1.MavComponent.MAV_COMP_ID_USER1);
            protocolVer.target_system = mav_component_1.MavComponent.MAV_COMP_ID_AUTOPILOT1;
            protocolVer.target_component = mav_component_1.MavComponent.MAV_COMP_ID_AUTOPILOT1;
            protocolVer.command = mav_cmd_1.MavCmd.MAV_CMD_REQUEST_MESSAGE;
            protocolVer.confirmation = 0;
            this._sp.write(this._apMavlink.pack([protocolVer]));
        }
    }
    _initComPort() {
        if (!this._sp || !this._sp.isOpen) {
            this._sp = new Serialport(this._comName, {
                baudRate: this._baudRate,
            }, (err) => {
                if (err) {
                    this._sp = undefined;
                    setTimeout(() => {
                        this._initComPort();
                    }, 5000);
                    return;
                }
                this._apMavlink = new node_mavlink_1.MAVLinkModule(message_registry_1.messageRegistry, mav_component_1.MavComponent.MAV_COMP_ID_AUTOPILOT1, false);
                this._apMavlink.upgradeLink();
                this._notifyArduPilot();
                this._apMavlink.on('message', (message) => {
                    // event listener for sensor data
                    if (!this._msgMap.has(message._message_name)) {
                        if (message._system_id === mav_component_1.MavComponent.MAV_COMP_ID_AUTOPILOT1 &&
                            message._component_id === mav_component_1.MavComponent.MAV_COMP_ID_AUTOPILOT1) {
                            if (message._message_name === 'BATTERY_STATUS') {
                                this._msgMap.set(message._message_name, this._copyFields(message, [
                                    'voltages'
                                ]));
                            }
                            else if (message._message_name === 'GLOBAL_POSITION_INT') {
                                this._msgMap.set(message._message_name, this._copyFields(message, [
                                    'lat',
                                    'lon',
                                    'alt',
                                    'relative_alt',
                                    'vx',
                                    'vy',
                                    'vz',
                                    'hdg'
                                ]));
                            }
                            this._apMavlinkLastTimestamp = (new Date()).getTime();
                        }
                    }
                });
                this._sp.on('data', (data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    try {
                        yield this._apMavlink.parse(data);
                        if (this._dataCallback) {
                            this._dataCallback(data);
                        }
                    }
                    catch (e) { }
                }));
            });
        }
    }
    _restartMsgTimer() {
        if (this._msgTimer) {
            clearTimeout(this._msgTimer);
        }
        if (this._msgInterval < 0 || !this._msgCallback) {
            return;
        }
        for (let [msgType, msg] of this._msgMap) {
            if (!msg.sent) {
                this._msgMap.delete(msgType);
                this._msgCallback(msgType, msg);
            }
        }
        this._msgCallback('test', { test: 123 });
        if (this._apMavlinkLastTimestamp < (new Date()).getTime() - 1000) {
            this._notifyArduPilot();
        }
        this._msgTimer = setTimeout(() => {
            this._restartMsgTimer();
        }, this._msgInterval);
    }
    sendRawData(data) {
        if (this._sp && this._sp.isOpen) {
            this._sp.write(data);
        }
    }
    set msgCallback(msgCallback) {
        this._msgCallback = msgCallback;
        this._restartMsgTimer();
    }
    set dataCallback(dataCallback) {
        this._dataCallback = dataCallback;
    }
    set msgInterval(msgInterval) {
        if (msgInterval <= 0) {
            this._msgInterval = -1;
        }
        else if (this._msgInterval !== msgInterval) {
            this._msgInterval = msgInterval;
            this._restartMsgTimer();
        }
    }
}
exports.ArduPilotControl = ArduPilotControl;
