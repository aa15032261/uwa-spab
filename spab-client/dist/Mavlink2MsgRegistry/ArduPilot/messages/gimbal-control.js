"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GimbalControl = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Control message for rate gimbal.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// demanded_rate_x Demanded angular rate X. float
// demanded_rate_y Demanded angular rate Y. float
// demanded_rate_z Demanded angular rate Z. float
class GimbalControl extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 201;
        this._message_name = 'GIMBAL_CONTROL';
        this._crc_extra = 205;
        this._message_fields = [
            ['demanded_rate_x', 'float', false],
            ['demanded_rate_y', 'float', false],
            ['demanded_rate_z', 'float', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.GimbalControl = GimbalControl;
