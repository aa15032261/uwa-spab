"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavFilterBias = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Accelerometer and Gyro biases from the navigation filter
*/
// usec Timestamp (microseconds) uint64_t
// accel_0 b_f[0] float
// accel_1 b_f[1] float
// accel_2 b_f[2] float
// gyro_0 b_f[0] float
// gyro_1 b_f[1] float
// gyro_2 b_f[2] float
class NavFilterBias extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 220;
        this._message_name = 'NAV_FILTER_BIAS';
        this._crc_extra = 34;
        this._message_fields = [
            ['usec', 'uint64_t', false],
            ['accel_0', 'float', false],
            ['accel_1', 'float', false],
            ['accel_2', 'float', false],
            ['gyro_0', 'float', false],
            ['gyro_1', 'float', false],
            ['gyro_2', 'float', false],
        ];
    }
}
exports.NavFilterBias = NavFilterBias;
