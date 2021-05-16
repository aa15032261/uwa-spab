"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ahrs3 = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Status of third AHRS filter if available. This is for ANU research group (Ali and Sean).
*/
// roll Roll angle. float
// pitch Pitch angle. float
// yaw Yaw angle. float
// altitude Altitude (MSL). float
// lat Latitude. int32_t
// lng Longitude. int32_t
// v1 Test variable1. float
// v2 Test variable2. float
// v3 Test variable3. float
// v4 Test variable4. float
class Ahrs3 extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 182;
        this._message_name = 'AHRS3';
        this._crc_extra = 229;
        this._message_fields = [
            ['roll', 'float', false],
            ['pitch', 'float', false],
            ['yaw', 'float', false],
            ['altitude', 'float', false],
            ['lat', 'int32_t', false],
            ['lng', 'int32_t', false],
            ['v1', 'float', false],
            ['v2', 'float', false],
            ['v3', 'float', false],
            ['v4', 'float', false],
        ];
    }
}
exports.Ahrs3 = Ahrs3;
