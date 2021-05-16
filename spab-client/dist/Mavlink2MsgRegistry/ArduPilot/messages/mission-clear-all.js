"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionClearAll = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Delete all mission items at once.
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// mission_type Mission type. uint8_t
class MissionClearAll extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 45;
        this._message_name = 'MISSION_CLEAR_ALL';
        this._crc_extra = 232;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['mission_type', 'uint8_t', true],
        ];
    }
}
exports.MissionClearAll = MissionClearAll;
