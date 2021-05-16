"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionRequestList = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request the overall list of mission items from the system/component.
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// mission_type Mission type. uint8_t
class MissionRequestList extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 43;
        this._message_name = 'MISSION_REQUEST_LIST';
        this._crc_extra = 132;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['mission_type', 'uint8_t', true],
        ];
    }
}
exports.MissionRequestList = MissionRequestList;
