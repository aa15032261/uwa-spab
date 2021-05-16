"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionAck = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Acknowledgment message during waypoint handling. The type field states if this message is a positive ack (type=0) or if an error happened (type=non-zero).
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// type Mission result. uint8_t
// mission_type Mission type. uint8_t
class MissionAck extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 47;
        this._message_name = 'MISSION_ACK';
        this._crc_extra = 153;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['type', 'uint8_t', false],
            ['mission_type', 'uint8_t', true],
        ];
    }
}
exports.MissionAck = MissionAck;
