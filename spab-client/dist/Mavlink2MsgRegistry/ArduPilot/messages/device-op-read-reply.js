"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceOpReadReply = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Read registers reply.
*/
// request_id Request ID - copied from request. uint32_t
// result 0 for success, anything else is failure code. uint8_t
// regstart Starting register. uint8_t
// count Count of bytes read. uint8_t
// data Reply data. uint8_t
// bank Bank number. uint8_t
class DeviceOpReadReply extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11001;
        this._message_name = 'DEVICE_OP_READ_REPLY';
        this._crc_extra = 15;
        this._message_fields = [
            ['request_id', 'uint32_t', false],
            ['result', 'uint8_t', false],
            ['regstart', 'uint8_t', false],
            ['count', 'uint8_t', false],
            ['data', 'uint8_t', false],
            ['bank', 'uint8_t', true],
        ];
    }
}
exports.DeviceOpReadReply = DeviceOpReadReply;
