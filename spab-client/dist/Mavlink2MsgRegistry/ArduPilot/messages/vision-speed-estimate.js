"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisionSpeedEstimate = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Speed estimate from a vision source.
*/
// usec Timestamp (UNIX time or time since system boot) uint64_t
// x Global X speed float
// y Global Y speed float
// z Global Z speed float
// covariance Row-major representation of 3x3 linear velocity covariance matrix (states: vx, vy, vz; 1st three entries - 1st row, etc.). If unknown, assign NaN value to first element in the array. float
// reset_counter Estimate reset counter. This should be incremented when the estimate resets in any of the dimensions (position, velocity, attitude, angular speed). This is designed to be used when e.g an external SLAM system detects a loop-closure and the estimate jumps. uint8_t
class VisionSpeedEstimate extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 103;
        this._message_name = 'VISION_SPEED_ESTIMATE';
        this._crc_extra = 208;
        this._message_fields = [
            ['usec', 'uint64_t', false],
            ['x', 'float', false],
            ['y', 'float', false],
            ['z', 'float', false],
            ['covariance', 'float', true],
            ['reset_counter', 'uint8_t', true],
        ];
    }
}
exports.VisionSpeedEstimate = VisionSpeedEstimate;
