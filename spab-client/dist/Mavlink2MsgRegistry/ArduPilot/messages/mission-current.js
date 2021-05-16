"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionCurrent = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Message that announces the sequence number of the current active mission item. The MAV will fly towards this mission item.
*/
// seq Sequence uint16_t
class MissionCurrent extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 42;
        this._message_name = 'MISSION_CURRENT';
        this._crc_extra = 28;
        this._message_fields = [
            ['seq', 'uint16_t', false],
        ];
    }
}
exports.MissionCurrent = MissionCurrent;
