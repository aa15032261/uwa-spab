"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttitudeTarget = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Reports the current commanded attitude of the vehicle as specified by the autopilot. This should match the commands sent in a SET_ATTITUDE_TARGET message if the vehicle is being controlled this way.
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// type_mask Mappings: If any of these bits are set, the corresponding input should be ignored: bit 1: body roll rate, bit 2: body pitch rate, bit 3: body yaw rate. bit 4-bit 7: reserved, bit 8: attitude uint8_t
// q Attitude quaternion (w, x, y, z order, zero-rotation is 1, 0, 0, 0) float
// body_roll_rate Body roll rate float
// body_pitch_rate Body pitch rate float
// body_yaw_rate Body yaw rate float
// thrust Collective thrust, normalized to 0 .. 1 (-1 .. 1 for vehicles capable of reverse trust) float
class AttitudeTarget extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 83;
        this._message_name = 'ATTITUDE_TARGET';
        this._crc_extra = 22;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['q', 'float', false],
            ['body_roll_rate', 'float', false],
            ['body_pitch_rate', 'float', false],
            ['body_yaw_rate', 'float', false],
            ['thrust', 'float', false],
            ['type_mask', 'uint8_t', false],
        ];
    }
}
exports.AttitudeTarget = AttitudeTarget;
