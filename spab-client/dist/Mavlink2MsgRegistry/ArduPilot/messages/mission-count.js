"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionCount = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
This message is emitted as response to MISSION_REQUEST_LIST by the MAV and to initiate a write transaction. The GCS can then request the individual mission item based on the knowledge of the total number of waypoints.
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// count Number of mission items in the sequence uint16_t
// mission_type Mission type. uint8_t
class MissionCount extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 44;
        this._message_name = 'MISSION_COUNT';
        this._crc_extra = 221;
        this._message_fields = [
            ['count', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['mission_type', 'uint8_t', true],
        ];
    }
}
exports.MissionCount = MissionCount;
