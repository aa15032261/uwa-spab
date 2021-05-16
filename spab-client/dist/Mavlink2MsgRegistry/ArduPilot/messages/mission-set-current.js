"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionSetCurrent = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Set the mission item with sequence number seq as current item. This means that the MAV will continue to this mission item on the shortest path (not following the mission items in-between).
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// seq Sequence uint16_t
class MissionSetCurrent extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 41;
        this._message_name = 'MISSION_SET_CURRENT';
        this._crc_extra = 28;
        this._message_fields = [
            ['seq', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.MissionSetCurrent = MissionSetCurrent;
