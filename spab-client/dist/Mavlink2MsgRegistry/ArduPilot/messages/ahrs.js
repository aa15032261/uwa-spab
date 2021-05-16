"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ahrs = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Status of DCM attitude estimator.
*/
// omegaIx X gyro drift estimate. float
// omegaIy Y gyro drift estimate. float
// omegaIz Z gyro drift estimate. float
// accel_weight Average accel_weight. float
// renorm_val Average renormalisation value. float
// error_rp Average error_roll_pitch value. float
// error_yaw Average error_yaw value. float
class Ahrs extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 163;
        this._message_name = 'AHRS';
        this._crc_extra = 127;
        this._message_fields = [
            ['omegaIx', 'float', false],
            ['omegaIy', 'float', false],
            ['omegaIz', 'float', false],
            ['accel_weight', 'float', false],
            ['renorm_val', 'float', false],
            ['error_rp', 'float', false],
            ['error_yaw', 'float', false],
        ];
    }
}
exports.Ahrs = Ahrs;
