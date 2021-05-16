"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageInterval = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The interval between messages for a particular MAVLink message ID. This message is the response to the MAV_CMD_GET_MESSAGE_INTERVAL command. This interface replaces DATA_STREAM.
*/
// message_id The ID of the requested MAVLink message. v1.0 is limited to 254 messages. uint16_t
// interval_us The interval between two messages. A value of -1 indicates this stream is disabled, 0 indicates it is not available, > 0 indicates the interval at which it is sent. int32_t
class MessageInterval extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 244;
        this._message_name = 'MESSAGE_INTERVAL';
        this._crc_extra = 95;
        this._message_fields = [
            ['interval_us', 'int32_t', false],
            ['message_id', 'uint16_t', false],
        ];
    }
}
exports.MessageInterval = MessageInterval;
