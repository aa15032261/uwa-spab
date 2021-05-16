import { MAVLinkModule, MAVLinkMessage } from '@ifrunistuttgart/node-mavlink';  
import { messageRegistry as ArduPilotMsgRegistry } from './Mavlink2MsgRegistry/ArduPilot/message-registry';

import * as Serialport from 'serialport';

// mavlink message definition files is generated with the offical mavlink package:
// See http://mavlink.io/en/getting_started/generate_libraries.html for more info.
// See https://github.com/ArduPilot/pymavlink for more info.
//
// Command to generate message definition library for TypeScript
// python3 -m pymavlink.tools.mavgen --lang=TypeScript --wire-protocol=2.0 ./message_definitions/v1.0/ardupilotmega.xml -o ~/output
import { CommandLong } from './Mavlink2MsgRegistry/ArduPilot/messages/command-long';
import { MavComponent } from './Mavlink2MsgRegistry/ArduPilot/enums/mav-component';
import { MavCmd } from './Mavlink2MsgRegistry/ArduPilot/enums/mav-cmd';

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


    /**
     * ArduPilotControl manages Mavlink connection and decodes Mavlink packets.
     * 
     * @param {string} comName - Com port device path
     * @param {number} baudRate - Com port baud rate
     */
    constructor (
        comName: string,
        baudRate: number
    ) {
        this._comName = comName;
        this._baudRate = baudRate;

        this._initComPort();
    }

    /**
     * Mavlink message callback
     */
    set msgCallback(msgCallback: (msgType: string, obj: Object) => void) {
        this._msgCallback = msgCallback;
        this._restartMsgTimer();
    }

    /**
     * Mavlink raw data callback
     */
    set dataCallback(dataCallback: (data: Buffer) => void) {
        this._dataCallback = dataCallback;
    }

    /**
     * Mavlink message interval
     * 
     * When msgInterval is set to a positive number, 
     * ArduPilotControl creates a timer to periodically
     * send received messages to msgCallback.
     */
    set msgInterval(msgInterval: number) {
        if (msgInterval <= 0) {
            this._msgInterval = -1;
        } else if (this._msgInterval !== msgInterval) {
            this._msgInterval = msgInterval;
            this._restartMsgTimer();
        }
    }

    /**
     * Copies the specified fields from an object to a new object.
     * 
     * @param {any} obj - Object to copy
     * @param {string[]} fields - Fields to copy
     * @returns {any} - The new object contains the specified fields copied from the original object.
     */
    private _copyFields(obj: any, fields: string[]) {
        let newObj: any = {};

        for (let field of fields) {
            newObj[field] = obj[field];
        }

        return newObj;
    }

    /**
     * Sends a MAV_CMD_REQUEST_MESSAGE message to ArduPilot controller 
     * to indicate that the client app is ready to receive packets.
     */
    private _notifyArduPilot() {
        if (this._sp && this._sp.isOpen) {
            // Set client app's system id and component id
            let protocolVer = new CommandLong(
                MavComponent.MAV_COMP_ID_AUTOPILOT1, 
                MavComponent.MAV_COMP_ID_USER1
            );

            // Set ArduPilot controller as target
            protocolVer.target_system = MavComponent.MAV_COMP_ID_AUTOPILOT1;
            protocolVer.target_component = MavComponent.MAV_COMP_ID_AUTOPILOT1;

            protocolVer.command = MavCmd.MAV_CMD_REQUEST_MESSAGE;

            // Resets confirmation to 0
            protocolVer.confirmation = 0;

            // Sends message via com port
            this._sp.write(this._apMavlink!.pack([protocolVer]));
        }
    }

    /**
     * Initialises com port
     */
    private _initComPort() {
        if (!this._sp || !this._sp.isOpen) {
            this._sp = new Serialport(this._comName, {
                baudRate: this._baudRate,
            }, (err) => {

                // Retries after 5 seconds if error occured
                if (err) {
                    this._sp = undefined;
                    setTimeout(() => {
                        this._initComPort();
                    }, 5000);
                    return;
                }

                // Initialises mavlink module
                this._apMavlink = new MAVLinkModule(
                    ArduPilotMsgRegistry,
                    MavComponent.MAV_COMP_ID_AUTOPILOT1,
                    false
                );
                // Enables mavlink 2.0
                this._apMavlink.upgradeLink();

                this._notifyArduPilot();

                // Handles decoded mavlink messages
                this._apMavlink.on('message', (message: MAVLinkMessage) => {  
                    // Handles only the messages from ArduPilot controller
                    if (
                        message._system_id === MavComponent.MAV_COMP_ID_AUTOPILOT1 &&
                        message._component_id === MavComponent.MAV_COMP_ID_AUTOPILOT1
                    ) {
                        // TODO:
                        // Defines messages to pass to _msgCallback
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
                });  
                  
                // Receives data from com port
                this._sp!.on('data', async (data: Buffer) => {
                    try {
                        // Decodes mavlink data
                        await this._apMavlink!.parse(data);

                        // Sends raw data to _dataCallback
                        if (this._dataCallback) {
                            this._dataCallback(data);
                        }
                    } catch (e) { }
                });
            });
        }
    }

    /**
     * Restarts the message callback timer.
     */
    private _restartMsgTimer() {
        if (this._msgTimer) {
            clearTimeout(this._msgTimer);
        }

        if (this._msgInterval < 0 || !this._msgCallback) {
            return;
        }

        // For each message received, sends it to _msgCallback
        for (let [msgType, msg] of this._msgMap) {
            if (!msg.sent) {
                this._msgMap.delete(msgType);
                this._msgCallback(msgType, msg);
            }
        }

        // No new messages received within 5 seconds, 
        // notifies the ArduPilot controller again.
        if (this._apMavlinkLastTimestamp < (new Date()).getTime() - 5000) {
            this._notifyArduPilot();
        }

        // Runs again after a specified interval defined in _msgInterval
        this._msgTimer = setTimeout(() => {
            this._restartMsgTimer();
        }, this._msgInterval);
    }

    /**
     * Sends raw mavlink data to the com port
     * 
     * @param {Buffer} data - Raw mavlink data 
     */
    public sendRawData(data: Buffer) {
        if (this._sp && this._sp.isOpen) {
            this._sp.write(data);
        }
    }
}