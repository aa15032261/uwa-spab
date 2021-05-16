"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAttitudeTarget = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Sets a desired vehicle attitude. Used by an external controller to command the vehicle (manual controller or other system).
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// target_system System ID uint8_t
// target_component Component ID uint8_t
// type_mask Mappings: If any of these bits are set, the corresponding input should be ignored: bit 1: body roll rate, bit 2: body pitch rate, bit 3: body yaw rate. bit 4-bit 6: reserved, bit 7: throttle, bit 8: attitude uint8_t
// q Attitude quaternion (w, x, y, z order, zero-rotation is 1, 0, 0, 0) float
// body_roll_rate Body roll rate float
// body_pitch_rate Body pitch rate float
// body_yaw_rate Body yaw rate float
// thrust Collective thrust, normalized to 0 .. 1 (-1 .. 1 for vehicles capable of reverse trust) float
class SetAttitudeTarget extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 82;
        this._message_name = 'SET_ATTITUDE_TARGET';
        this._crc_extra = 49;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['q', 'float', false],
            ['body_roll_rate', 'float', false],
            ['body_pitch_rate', 'float', false],
            ['body_yaw_rate', 'float', false],
            ['thrust', 'float', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['type_mask', 'uint8_t', false],
        ];
    }
}
exports.SetAttitudeTarget = SetAttitudeTarget;
