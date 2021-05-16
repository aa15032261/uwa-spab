"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OsdParamShowConfigReply = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Read configured OSD parameter reply.
*/
// request_id Request ID - copied from request. uint32_t
// result Config error type. uint8_t
// param_id Onboard parameter id, terminated by NULL if the length is less than 16 human-readable chars and WITHOUT null termination (NULL) byte if the length is exactly 16 chars - applications have to provide 16+1 bytes storage if the ID is stored as string char
// config_type Config type. uint8_t
// min_value OSD parameter minimum value. float
// max_value OSD parameter maximum value. float
// increment OSD parameter increment. float
class OsdParamShowConfigReply extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11036;
        this._message_name = 'OSD_PARAM_SHOW_CONFIG_REPLY';
        this._crc_extra = 177;
        this._message_fields = [
            ['request_id', 'uint32_t', false],
            ['min_value', 'float', false],
            ['max_value', 'float', false],
            ['increment', 'float', false],
            ['result', 'uint8_t', false],
            ['param_id', 'char', false],
            ['config_type', 'uint8_t', false],
        ];
    }
}
exports.OsdParamShowConfigReply = OsdParamShowConfigReply;
