"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionWritePartialList = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
This message is sent to the MAV to write a partial list. If start index == end index, only one item will be transmitted / updated. If the start index is NOT 0 and above the current list size, this request should be REJECTED!
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// start_index Start index. Must be smaller / equal to the largest index of the current onboard list. int16_t
// end_index End index, equal or greater than start index. int16_t
// mission_type Mission type. uint8_t
class MissionWritePartialList extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 38;
        this._message_name = 'MISSION_WRITE_PARTIAL_LIST';
        this._crc_extra = 9;
        this._message_fields = [
            ['start_index', 'int16_t', false],
            ['end_index', 'int16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['mission_type', 'uint8_t', true],
        ];
    }
}
exports.MissionWritePartialList = MissionWritePartialList;
