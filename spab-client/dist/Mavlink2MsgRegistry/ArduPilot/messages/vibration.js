"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vibration = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Vibration levels and accelerometer clipping
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// vibration_x Vibration levels on X-axis float
// vibration_y Vibration levels on Y-axis float
// vibration_z Vibration levels on Z-axis float
// clipping_0 first accelerometer clipping count uint32_t
// clipping_1 second accelerometer clipping count uint32_t
// clipping_2 third accelerometer clipping count uint32_t
class Vibration extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 241;
        this._message_name = 'VIBRATION';
        this._crc_extra = 90;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['vibration_x', 'float', false],
            ['vibration_y', 'float', false],
            ['vibration_z', 'float', false],
            ['clipping_0', 'uint32_t', false],
            ['clipping_1', 'uint32_t', false],
            ['clipping_2', 'uint32_t', false],
        ];
    }
}
exports.Vibration = Vibration;
