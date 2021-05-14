import {MAVLinkModule, MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';  
import { messageRegistry as ArduPilotMsgRegistry } from './Mavlink2MsgRegistry/ArduPilot/message-registry';

import * as Serialport from 'serialport';

// python3 -m pymavlink.tools.mavgen --lang=TypeScript --wire-protocol=2.0 /Users/tomchan/opt/anaconda3/lib/python3.8/site-packages/pymavlink/message_definitions/v1.0/ardupilotmega.xml -o ~/test
import { CommandLong } from './Mavlink2MsgRegistry/ArduPilot/messages/command-long';
import { MavComponent } from './Mavlink2MsgRegistry/ArduPilot/enums/mav-component';
import { MavCmd } from './Mavlink2MsgRegistry/ArduPilot/enums/mav-cmd';
import { clear } from 'console';

const GLOBAL_POSITION_INT = 33;

interface Msg {
    sent: boolean;
    msg: Object;
}

export class ArduPilotControl {

    private _msgCallback: ((msgType: string, msg: Object) => void) | undefined;
    private _dataCallback: ((data: Buffer) => void) | undefined;

    private _msgInterval = -1;
    private _msgTimer: NodeJS.Timeout | undefined;
    private _msgMap = new Map<string, Msg>();

    private _apMavlink: MAVLinkModule | undefined;
    private _apMavlinkLastTimestamp = 0;

    private _sp: Serialport | undefined;
    private _comName = '';
    private _baudRate = 57600;

    private _apMavlinkTimer: NodeJS.Timeout | undefined;

    private _copyFields(obj: any, fields: string[]) {
        let newObj: any = {};

        for (let field of fields) {
            newObj[field] = obj[field];
        }

        return newObj;
    }

    private _notifyArduPilot() {
        if (this._sp && this._sp.isOpen) {
            let protocolVer = new CommandLong(
                MavComponent.MAV_COMP_ID_AUTOPILOT1, 
                MavComponent.MAV_COMP_ID_USER1
            );
            protocolVer.target_system = MavComponent.MAV_COMP_ID_AUTOPILOT1;
            protocolVer.target_component = MavComponent.MAV_COMP_ID_AUTOPILOT1;
            protocolVer.command = MavCmd.MAV_CMD_REQUEST_MESSAGE;
            protocolVer.confirmation = 0;
            this._sp.write(this._apMavlink!.pack([protocolVer]));
        }
    }

    private _initComPort() {
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

                this._apMavlink = new MAVLinkModule(
                    ArduPilotMsgRegistry,
                    MavComponent.MAV_COMP_ID_AUTOPILOT1,
                    false
                );

                this._apMavlink.upgradeLink();
                this._notifyArduPilot();

                this._apMavlink.on('message', (message: MAVLinkMessage) => {  
                    // event listener for sensor data

                    if (!this._msgMap.has(message._message_name)) {
                        if (
                            message._system_id === MavComponent.MAV_COMP_ID_AUTOPILOT1 &&
                            message._component_id === MavComponent.MAV_COMP_ID_AUTOPILOT1
                        ) {
                            if (message._message_name === 'BATTERY_STATUS') {
                                this._msgMap.set(
                                    message._message_name,
                                    this._copyFields(message, [
                                        'voltages'
                                    ])
                                );
                            } else if (message._message_name === 'GLOBAL_POSITION_INT') {
                                this._msgMap.set(
                                    message._message_name,
                                    this._copyFields(message, [
                                        'lat',
                                        'lon',
                                        'alt',
                                        'relative_alt',
                                        'vx',
                                        'vy',
                                        'vz',
                                        'hdg'
                                    ])
                                );
                            }
                            this._apMavlinkLastTimestamp = (new Date()).getTime();
                        }
                    }
                });  
                  
                this._sp!.on('data', async (data: Buffer) => {
                    try {
                        await this._apMavlink!.parse(data);

                        if (this._dataCallback) {
                            this._dataCallback(data);
                        }
                    } catch (e) { }
                });
            });
        }
    }

    private _restartMsgTimer() {
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

        if (this._apMavlinkLastTimestamp < (new Date()).getTime() - 1000) {
            this._notifyArduPilot();
        }

        this._msgTimer = setTimeout(() => {
            this._restartMsgTimer();
        }, this._msgInterval);
    }

    public sendRawData(data: Buffer) {
        if (this._sp && this._sp.isOpen) {
            this._sp.write(data);
        }
    }

    constructor (
        comName: string,
        baudRate: number
    ) {
        this._comName = comName;
        this._baudRate = baudRate;

        this._initComPort();
    }

    set msgCallback(msgCallback: (msgType: string, obj: Object) => void) {
        this._msgCallback = msgCallback;
        this._restartMsgTimer();
    }

    set dataCallback(dataCallback: (data: Buffer) => void) {
        this._dataCallback = dataCallback;
    }

    set msgInterval(msgInterval: number) {
        if (msgInterval <= 0) {
            this._msgInterval = -1;
        } else if (this._msgInterval !== msgInterval) {
            this._msgInterval = msgInterval;
            this._restartMsgTimer();
        }
    }
}