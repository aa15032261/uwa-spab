"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingDataAcked = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
A message containing logged data which requires a LOGGING_ACK to be sent back
*/
// target_system system ID of the target uint8_t
// target_component component ID of the target uint8_t
// sequence sequence number (can wrap) uint16_t
// length data length uint8_t
// first_message_offset offset into data where first message starts. This can be used for recovery, when a previous message got lost (set to 255 if no start exists). uint8_t
// data logged data uint8_t
class LoggingDataAcked extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 267;
        this._message_name = 'LOGGING_DATA_ACKED';
        this._crc_extra = 35;
        this._message_fields = [
            ['sequence', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['length', 'uint8_t', false],
            ['first_message_offset', 'uint8_t', false],
            ['data', 'uint8_t', false],
        ];
    }
}
exports.LoggingDataAcked = LoggingDataAcked;
