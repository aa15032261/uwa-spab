"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionRequestInt = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request the information of the mission item with the sequence number seq. The response of the system to this message should be a MISSION_ITEM_INT message. https://mavlink.io/en/services/mission.html
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// seq Sequence uint16_t
// mission_type Mission type. uint8_t
class MissionRequestInt extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 51;
        this._message_name = 'MISSION_REQUEST_INT';
        this._crc_extra = 196;
        this._message_fields = [
            ['seq', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['mission_type', 'uint8_t', true],
        ];
    }
}
exports.MissionRequestInt = MissionRequestInt;
