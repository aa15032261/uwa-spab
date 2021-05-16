"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingAck = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
An ack for a LOGGING_DATA_ACKED message
*/
// target_system system ID of the target uint8_t
// target_component component ID of the target uint8_t
// sequence sequence number (must match the one in LOGGING_DATA_ACKED) uint16_t
class LoggingAck extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 268;
        this._message_name = 'LOGGING_ACK';
        this._crc_extra = 14;
        this._message_fields = [
            ['sequence', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.LoggingAck = LoggingAck;
