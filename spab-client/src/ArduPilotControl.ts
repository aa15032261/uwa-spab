import {MAVLinkModule, MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';  
import { messageRegistry as ArduPilotMsgRegistry } from './Mavlink2MsgRegistry/ArduPilot/message-registry';

import * as Serialport from 'serialport';

export class ArduPilotControl {

    arduPilotMavlink: MAVLinkModule = new MAVLinkModule(ArduPilotMsgRegistry);
    sp: Serialport;

    constructor (
        comName: string,
        baudRate: number
    ) {
        this.sp = new Serialport(comName, {  
            baudRate: baudRate  
        });

        this.sp.on('data', (data: Buffer) => {  
            this.arduPilotMavlink.parse(data);  
        });

        this.arduPilotMavlink.on('error', (e: Error) => {  
            // event listener for node-mavlink ALL error message  
            console.log(e);
        });  
          
        this.arduPilotMavlink.on('message', (message: MAVLinkMessage) => {  
            // event listener for all messages  
            console.log(message);  
        });  
          
        this.arduPilotMavlink.on('COMMAND_LONG', (bytes: Buffer) => {  
            //console.log('Sending COMMAND_LONG to PX4');  
            //serialPort.write(bytes);  
        });  
          
        this.arduPilotMavlink.on('HIGHRES_IMU', (message: MAVLinkMessage) => {  
            // event listener for HIGHRES_IMU message  
            //console.log(message);  
        });
    }
}