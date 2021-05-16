"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoproGetResponse = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Response from a GOPRO_COMMAND get request.
*/
// cmd_id Command ID. uint8_t
// status Status. uint8_t
// value Value. uint8_t
class GoproGetResponse extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 217;
        this._message_name = 'GOPRO_GET_RESPONSE';
        this._crc_extra = 202;
        this._message_fields = [
            ['cmd_id', 'uint8_t', false],
            ['status', 'uint8_t', false],
            ['value', 'uint8_t', false],
        ];
    }
}
exports.GoproGetResponse = GoproGetResponse;
