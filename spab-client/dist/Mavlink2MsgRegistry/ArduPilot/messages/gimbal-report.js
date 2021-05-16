"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GimbalReport = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
3 axis gimbal measurements.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// delta_time Time since last update. float
// delta_angle_x Delta angle X. float
// delta_angle_y Delta angle Y. float
// delta_angle_z Delta angle X. float
// delta_velocity_x Delta velocity X. float
// delta_velocity_y Delta velocity Y. float
// delta_velocity_z Delta velocity Z. float
// joint_roll Joint ROLL. float
// joint_el Joint EL. float
// joint_az Joint AZ. float
class GimbalReport extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 200;
        this._message_name = 'GIMBAL_REPORT';
        this._crc_extra = 134;
        this._message_fields = [
            ['delta_time', 'float', false],
            ['delta_angle_x', 'float', false],
            ['delta_angle_y', 'float', false],
            ['delta_angle_z', 'float', false],
            ['delta_velocity_x', 'float', false],
            ['delta_velocity_y', 'float', false],
            ['delta_velocity_z', 'float', false],
            ['joint_roll', 'float', false],
            ['joint_el', 'float', false],
            ['joint_az', 'float', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.GimbalReport = GimbalReport;
