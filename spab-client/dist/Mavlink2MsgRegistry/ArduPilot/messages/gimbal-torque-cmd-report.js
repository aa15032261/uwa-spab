"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GimbalTorqueCmdReport = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
100 Hz gimbal torque command telemetry.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// rl_torque_cmd Roll Torque Command. int16_t
// el_torque_cmd Elevation Torque Command. int16_t
// az_torque_cmd Azimuth Torque Command. int16_t
class GimbalTorqueCmdReport extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 214;
        this._message_name = 'GIMBAL_TORQUE_CMD_REPORT';
        this._crc_extra = 69;
        this._message_fields = [
            ['rl_torque_cmd', 'int16_t', false],
            ['el_torque_cmd', 'int16_t', false],
            ['az_torque_cmd', 'int16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.GimbalTorqueCmdReport = GimbalTorqueCmdReport;
