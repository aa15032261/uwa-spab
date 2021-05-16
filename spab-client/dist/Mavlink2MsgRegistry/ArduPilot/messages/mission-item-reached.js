"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionItemReached = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
A certain mission item has been reached. The system will either hold this position (or circle on the orbit) or (if the autocontinue on the WP was set) continue to the next waypoint.
*/
// seq Sequence uint16_t
class MissionItemReached extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 46;
        this._message_name = 'MISSION_ITEM_REACHED';
        this._crc_extra = 11;
        this._message_fields = [
            ['seq', 'uint16_t', false],
        ];
    }
}
exports.MissionItemReached = MissionItemReached;
