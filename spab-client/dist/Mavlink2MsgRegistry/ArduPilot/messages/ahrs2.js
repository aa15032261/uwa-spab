"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ahrs2 = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Status of secondary AHRS filter if available.
*/
// roll Roll angle. float
// pitch Pitch angle. float
// yaw Yaw angle. float
// altitude Altitude (MSL). float
// lat Latitude. int32_t
// lng Longitude. int32_t
class Ahrs2 extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 178;
        this._message_name = 'AHRS2';
        this._crc_extra = 47;
        this._message_fields = [
            ['roll', 'float', false],
            ['pitch', 'float', false],
            ['yaw', 'float', false],
            ['altitude', 'float', false],
            ['lat', 'int32_t', false],
            ['lng', 'int32_t', false],
        ];
    }
}
exports.Ahrs2 = Ahrs2;
