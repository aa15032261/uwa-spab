"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attitude = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The attitude in the aeronautical frame (right-handed, Z-down, X-front, Y-right).
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// roll Roll angle (-pi..+pi) float
// pitch Pitch angle (-pi..+pi) float
// yaw Yaw angle (-pi..+pi) float
// rollspeed Roll angular speed float
// pitchspeed Pitch angular speed float
// yawspeed Yaw angular speed float
class Attitude extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 30;
        this._message_name = 'ATTITUDE';
        this._crc_extra = 39;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['roll', 'float', false],
            ['pitch', 'float', false],
            ['yaw', 'float', false],
            ['rollspeed', 'float', false],
            ['pitchspeed', 'float', false],
            ['yawspeed', 'float', false],
        ];
    }
}
exports.Attitude = Attitude;
