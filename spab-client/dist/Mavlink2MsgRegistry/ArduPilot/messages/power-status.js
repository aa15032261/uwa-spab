"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Power supply status
*/
// Vcc 5V rail voltage. uint16_t
// Vservo Servo rail voltage. uint16_t
// flags Bitmap of power supply status flags. uint16_t
class PowerStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 125;
        this._message_name = 'POWER_STATUS';
        this._crc_extra = 203;
        this._message_fields = [
            ['Vcc', 'uint16_t', false],
            ['Vservo', 'uint16_t', false],
            ['flags', 'uint16_t', false],
        ];
    }
}
exports.PowerStatus = PowerStatus;
