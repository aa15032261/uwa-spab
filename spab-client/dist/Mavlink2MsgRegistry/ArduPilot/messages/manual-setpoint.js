"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualSetpoint = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Setpoint in roll, pitch, yaw and thrust from the operator
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// roll Desired roll rate float
// pitch Desired pitch rate float
// yaw Desired yaw rate float
// thrust Collective thrust, normalized to 0 .. 1 float
// mode_switch Flight mode switch position, 0.. 255 uint8_t
// manual_override_switch Override mode switch position, 0.. 255 uint8_t
class ManualSetpoint extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 81;
        this._message_name = 'MANUAL_SETPOINT';
        this._crc_extra = 106;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['roll', 'float', false],
            ['pitch', 'float', false],
            ['yaw', 'float', false],
            ['thrust', 'float', false],
            ['mode_switch', 'uint8_t', false],
            ['manual_override_switch', 'uint8_t', false],
        ];
    }
}
exports.ManualSetpoint = ManualSetpoint;
