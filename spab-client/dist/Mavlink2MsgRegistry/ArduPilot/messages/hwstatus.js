"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hwstatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Status of key hardware.
*/
// Vcc Board voltage. uint16_t
// I2Cerr I2C error count. uint8_t
class Hwstatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 165;
        this._message_name = 'HWSTATUS';
        this._crc_extra = 21;
        this._message_fields = [
            ['Vcc', 'uint16_t', false],
            ['I2Cerr', 'uint8_t', false],
        ];
    }
}
exports.Hwstatus = Hwstatus;
