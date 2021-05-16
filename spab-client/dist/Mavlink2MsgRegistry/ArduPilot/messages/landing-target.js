"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingTarget = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The location of a landing target. See: https://mavlink.io/en/services/landing_target.html
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// target_num The ID of the target if multiple targets are present uint8_t
// frame Coordinate frame used for following fields. uint8_t
// angle_x X-axis angular offset of the target from the center of the image float
// angle_y Y-axis angular offset of the target from the center of the image float
// distance Distance to the target from the vehicle float
// size_x Size of target along x-axis float
// size_y Size of target along y-axis float
// x X Position of the landing target in MAV_FRAME float
// y Y Position of the landing target in MAV_FRAME float
// z Z Position of the landing target in MAV_FRAME float
// q Quaternion of landing target orientation (w, x, y, z order, zero-rotation is 1, 0, 0, 0) float
// type Type of landing target uint8_t
// position_valid Boolean indicating whether the position fields (x, y, z, q, type) contain valid target position information (valid: 1, invalid: 0). Default is 0 (invalid). uint8_t
class LandingTarget extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 149;
        this._message_name = 'LANDING_TARGET';
        this._crc_extra = 200;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['angle_x', 'float', false],
            ['angle_y', 'float', false],
            ['distance', 'float', false],
            ['size_x', 'float', false],
            ['size_y', 'float', false],
            ['target_num', 'uint8_t', false],
            ['frame', 'uint8_t', false],
            ['x', 'float', true],
            ['y', 'float', true],
            ['z', 'float', true],
            ['q', 'float', true],
            ['type', 'uint8_t', true],
            ['position_valid', 'uint8_t', true],
        ];
    }
}
exports.LandingTarget = LandingTarget;
