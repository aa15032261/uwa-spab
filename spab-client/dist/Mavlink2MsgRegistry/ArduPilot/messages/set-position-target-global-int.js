"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPositionTargetGlobalInt = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Sets a desired vehicle position, velocity, and/or acceleration in a global coordinate system (WGS84). Used by an external controller to command the vehicle (manual controller or other system).
*/
// time_boot_ms Timestamp (time since system boot). The rationale for the timestamp in the setpoint is to allow the system to compensate for the transport delay of the setpoint. This allows the system to compensate processing latency. uint32_t
// target_system System ID uint8_t
// target_component Component ID uint8_t
// coordinate_frame Valid options are: MAV_FRAME_GLOBAL_INT = 5, MAV_FRAME_GLOBAL_RELATIVE_ALT_INT = 6, MAV_FRAME_GLOBAL_TERRAIN_ALT_INT = 11 uint8_t
// type_mask Bitmap to indicate which dimensions should be ignored by the vehicle. uint16_t
// lat_int X Position in WGS84 frame int32_t
// lon_int Y Position in WGS84 frame int32_t
// alt Altitude (MSL, Relative to home, or AGL - depending on frame) float
// vx X velocity in NED frame float
// vy Y velocity in NED frame float
// vz Z velocity in NED frame float
// afx X acceleration or force (if bit 10 of type_mask is set) in NED frame in meter / s^2 or N float
// afy Y acceleration or force (if bit 10 of type_mask is set) in NED frame in meter / s^2 or N float
// afz Z acceleration or force (if bit 10 of type_mask is set) in NED frame in meter / s^2 or N float
// yaw yaw setpoint float
// yaw_rate yaw rate setpoint float
class SetPositionTargetGlobalInt extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 86;
        this._message_name = 'SET_POSITION_TARGET_GLOBAL_INT';
        this._crc_extra = 5;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['lat_int', 'int32_t', false],
            ['lon_int', 'int32_t', false],
            ['alt', 'float', false],
            ['vx', 'float', false],
            ['vy', 'float', false],
            ['vz', 'float', false],
            ['afx', 'float', false],
            ['afy', 'float', false],
            ['afz', 'float', false],
            ['yaw', 'float', false],
            ['yaw_rate', 'float', false],
            ['type_mask', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['coordinate_frame', 'uint8_t', false],
        ];
    }
}
exports.SetPositionTargetGlobalInt = SetPositionTargetGlobalInt;
