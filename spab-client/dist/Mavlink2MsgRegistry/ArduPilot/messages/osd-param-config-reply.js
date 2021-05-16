"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OsdParamConfigReply = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Configure OSD parameter reply.
*/
// request_id Request ID - copied from request. uint32_t
// result Config error type. uint8_t
class OsdParamConfigReply extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11034;
        this._message_name = 'OSD_PARAM_CONFIG_REPLY';
        this._crc_extra = 79;
        this._message_fields = [
            ['request_id', 'uint32_t', false],
            ['result', 'uint8_t', false],
        ];
    }
}
exports.OsdParamConfigReply = OsdParamConfigReply;
