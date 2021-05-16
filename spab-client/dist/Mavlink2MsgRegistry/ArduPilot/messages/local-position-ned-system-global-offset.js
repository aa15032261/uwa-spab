"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPositionNedSystemGlobalOffset = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The offset in X, Y, Z and yaw between the LOCAL_POSITION_NED messages of MAV X and the global coordinate frame in NED coordinates. Coordinate frame is right-handed, Z-axis down (aeronautical frame, NED / north-east-down convention)
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// x X Position float
// y Y Position float
// z Z Position float
// roll Roll float
// pitch Pitch float
// yaw Yaw float
class LocalPositionNedSystemGlobalOffset extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 89;
        this._message_name = 'LOCAL_POSITION_NED_SYSTEM_GLOBAL_OFFSET';
        this._crc_extra = 231;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['x', 'float', false],
            ['y', 'float', false],
            ['z', 'float', false],
            ['roll', 'float', false],
            ['pitch', 'float', false],
            ['yaw', 'float', false],
        ];
    }
}
exports.LocalPositionNedSystemGlobalOffset = LocalPositionNedSystemGlobalOffset;
