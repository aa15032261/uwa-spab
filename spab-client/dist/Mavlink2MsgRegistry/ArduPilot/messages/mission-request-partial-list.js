"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionRequestPartialList = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request a partial list of mission items from the system/component. https://mavlink.io/en/services/mission.html. If start and end index are the same, just send one waypoint.
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// start_index Start index int16_t
// end_index End index, -1 by default (-1: send list to end). Else a valid index of the list int16_t
// mission_type Mission type. uint8_t
class MissionRequestPartialList extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 37;
        this._message_name = 'MISSION_REQUEST_PARTIAL_LIST';
        this._crc_extra = 212;
        this._message_fields = [
            ['start_index', 'int16_t', false],
            ['end_index', 'int16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['mission_type', 'uint8_t', true],
        ];
    }
}
exports.MissionRequestPartialList = MissionRequestPartialList;
