"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowTarget = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Current motion information from a designated system
*/
// timestamp Timestamp (time since system boot). uint64_t
// est_capabilities bit positions for tracker reporting capabilities (POS = 0, VEL = 1, ACCEL = 2, ATT + RATES = 3) uint8_t
// lat Latitude (WGS84) int32_t
// lon Longitude (WGS84) int32_t
// alt Altitude (MSL) float
// vel target velocity (0,0,0) for unknown float
// acc linear target acceleration (0,0,0) for unknown float
// attitude_q (1 0 0 0 for unknown) float
// rates (0 0 0 for unknown) float
// position_cov eph epv float
// custom_state button states or switches of a tracker device uint64_t
class FollowTarget extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 144;
        this._message_name = 'FOLLOW_TARGET';
        this._crc_extra = 127;
        this._message_fields = [
            ['timestamp', 'uint64_t', false],
            ['custom_state', 'uint64_t', false],
            ['lat', 'int32_t', false],
            ['lon', 'int32_t', false],
            ['alt', 'float', false],
            ['vel', 'float', false],
            ['acc', 'float', false],
            ['attitude_q', 'float', false],
            ['rates', 'float', false],
            ['position_cov', 'float', false],
            ['est_capabilities', 'uint8_t', false],
        ];
    }
}
exports.FollowTarget = FollowTarget;
