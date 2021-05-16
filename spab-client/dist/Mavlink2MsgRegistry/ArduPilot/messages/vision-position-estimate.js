"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisionPositionEstimate = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Local position/attitude estimate from a vision source.
*/
// usec Timestamp (UNIX time or time since system boot) uint64_t
// x Local X position float
// y Local Y position float
// z Local Z position float
// roll Roll angle float
// pitch Pitch angle float
// yaw Yaw angle float
// covariance Row-major representation of pose 6x6 cross-covariance matrix upper right triangle (states: x, y, z, roll, pitch, yaw; first six entries are the first ROW, next five entries are the second ROW, etc.). If unknown, assign NaN value to first element in the array. float
// reset_counter Estimate reset counter. This should be incremented when the estimate resets in any of the dimensions (position, velocity, attitude, angular speed). This is designed to be used when e.g an external SLAM system detects a loop-closure and the estimate jumps. uint8_t
class VisionPositionEstimate extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 102;
        this._message_name = 'VISION_POSITION_ESTIMATE';
        this._crc_extra = 158;
        this._message_fields = [
            ['usec', 'uint64_t', false],
            ['x', 'float', false],
            ['y', 'float', false],
            ['z', 'float', false],
            ['roll', 'float', false],
            ['pitch', 'float', false],
            ['yaw', 'float', false],
            ['covariance', 'float', true],
            ['reset_counter', 'uint8_t', true],
        ];
    }
}
exports.VisionPositionEstimate = VisionPositionEstimate;
