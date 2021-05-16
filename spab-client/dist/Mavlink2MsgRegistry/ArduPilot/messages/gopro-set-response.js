"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoproSetResponse = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Response from a GOPRO_COMMAND set request.
*/
// cmd_id Command ID. uint8_t
// status Status. uint8_t
class GoproSetResponse extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 219;
        this._message_name = 'GOPRO_SET_RESPONSE';
        this._crc_extra = 162;
        this._message_fields = [
            ['cmd_id', 'uint8_t', false],
            ['status', 'uint8_t', false],
        ];
    }
}
exports.GoproSetResponse = GoproSetResponse;
