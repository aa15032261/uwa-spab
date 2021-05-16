"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoproGetRequest = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request a GOPRO_COMMAND response from the GoPro.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// cmd_id Command ID. uint8_t
class GoproGetRequest extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 216;
        this._message_name = 'GOPRO_GET_REQUEST';
        this._crc_extra = 50;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['cmd_id', 'uint8_t', false],
        ];
    }
}
exports.GoproGetRequest = GoproGetRequest;
