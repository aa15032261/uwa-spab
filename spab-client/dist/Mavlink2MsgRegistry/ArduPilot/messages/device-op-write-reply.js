"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceOpWriteReply = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Write registers reply.
*/
// request_id Request ID - copied from request. uint32_t
// result 0 for success, anything else is failure code. uint8_t
class DeviceOpWriteReply extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11003;
        this._message_name = 'DEVICE_OP_WRITE_REPLY';
        this._crc_extra = 64;
        this._message_fields = [
            ['request_id', 'uint32_t', false],
            ['result', 'uint8_t', false],
        ];
    }
}
exports.DeviceOpWriteReply = DeviceOpWriteReply;
