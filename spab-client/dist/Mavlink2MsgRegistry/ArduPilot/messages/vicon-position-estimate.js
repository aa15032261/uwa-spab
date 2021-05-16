"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViconPositionEstimate = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Global position estimate from a Vicon motion system source.
*/
// usec Timestamp (UNIX time or time since system boot) uint64_t
// x Global X position float
// y Global Y position float
// z Global Z position float
// roll Roll angle float
// pitch Pitch angle float
// yaw Yaw angle float
// covariance Row-major representation of 6x6 pose cross-covariance matrix upper right triangle (states: x, y, z, roll, pitch, yaw; first six entries are the first ROW, next five entries are the second ROW, etc.). If unknown, assign NaN value to first element in the array. float
class ViconPositionEstimate extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 104;
        this._message_name = 'VICON_POSITION_ESTIMATE';
        this._crc_extra = 56;
        this._message_fields = [
            ['usec', 'uint64_t', false],
            ['x', 'float', false],
            ['y', 'float', false],
            ['z', 'float', false],
            ['roll', 'float', false],
            ['pitch', 'float', false],
            ['yaw', 'float', false],
            ['covariance', 'float', true],
        ];
    }
}
exports.ViconPositionEstimate = ViconPositionEstimate;
