"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlSystemState = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The smoothed, monotonic system state used to feed the control loops of the system.
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// x_acc X acceleration in body frame float
// y_acc Y acceleration in body frame float
// z_acc Z acceleration in body frame float
// x_vel X velocity in body frame float
// y_vel Y velocity in body frame float
// z_vel Z velocity in body frame float
// x_pos X position in local frame float
// y_pos Y position in local frame float
// z_pos Z position in local frame float
// airspeed Airspeed, set to -1 if unknown float
// vel_variance Variance of body velocity estimate float
// pos_variance Variance in local position float
// q The attitude, represented as Quaternion float
// roll_rate Angular rate in roll axis float
// pitch_rate Angular rate in pitch axis float
// yaw_rate Angular rate in yaw axis float
class ControlSystemState extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 146;
        this._message_name = 'CONTROL_SYSTEM_STATE';
        this._crc_extra = 103;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['x_acc', 'float', false],
            ['y_acc', 'float', false],
            ['z_acc', 'float', false],
            ['x_vel', 'float', false],
            ['y_vel', 'float', false],
            ['z_vel', 'float', false],
            ['x_pos', 'float', false],
            ['y_pos', 'float', false],
            ['z_pos', 'float', false],
            ['airspeed', 'float', false],
            ['vel_variance', 'float', false],
            ['pos_variance', 'float', false],
            ['q', 'float', false],
            ['roll_rate', 'float', false],
            ['pitch_rate', 'float', false],
            ['yaw_rate', 'float', false],
        ];
    }
}
exports.ControlSystemState = ControlSystemState;
