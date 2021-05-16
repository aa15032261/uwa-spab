"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttPosMocap = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Motion capture attitude and position
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// q Attitude quaternion (w, x, y, z order, zero-rotation is 1, 0, 0, 0) float
// x X position (NED) float
// y Y position (NED) float
// z Z position (NED) float
// covariance Row-major representation of a pose 6x6 cross-covariance matrix upper right triangle (states: x, y, z, roll, pitch, yaw; first six entries are the first ROW, next five entries are the second ROW, etc.). If unknown, assign NaN value to first element in the array. float
class AttPosMocap extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 138;
        this._message_name = 'ATT_POS_MOCAP';
        this._crc_extra = 109;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['q', 'float', false],
            ['x', 'float', false],
            ['y', 'float', false],
            ['z', 'float', false],
            ['covariance', 'float', true],
        ];
    }
}
exports.AttPosMocap = AttPosMocap;
