"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavControllerOutput = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The state of the fixed wing navigation and position controller.
*/
// nav_roll Current desired roll float
// nav_pitch Current desired pitch float
// nav_bearing Current desired heading int16_t
// target_bearing Bearing to current waypoint/target int16_t
// wp_dist Distance to active waypoint uint16_t
// alt_error Current altitude error float
// aspd_error Current airspeed error float
// xtrack_error Current crosstrack error on x-y plane float
class NavControllerOutput extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 62;
        this._message_name = 'NAV_CONTROLLER_OUTPUT';
        this._crc_extra = 183;
        this._message_fields = [
            ['nav_roll', 'float', false],
            ['nav_pitch', 'float', false],
            ['alt_error', 'float', false],
            ['aspd_error', 'float', false],
            ['xtrack_error', 'float', false],
            ['nav_bearing', 'int16_t', false],
            ['target_bearing', 'int16_t', false],
            ['wp_dist', 'uint16_t', false],
        ];
    }
}
exports.NavControllerOutput = NavControllerOutput;
