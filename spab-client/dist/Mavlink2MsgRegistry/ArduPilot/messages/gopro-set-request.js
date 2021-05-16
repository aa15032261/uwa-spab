"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoproSetRequest = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request to set a GOPRO_COMMAND with a desired.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// cmd_id Command ID. uint8_t
// value Value. uint8_t
class GoproSetRequest extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 218;
        this._message_name = 'GOPRO_SET_REQUEST';
        this._crc_extra = 17;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['cmd_id', 'uint8_t', false],
            ['value', 'uint8_t', false],
        ];
    }
}
exports.GoproSetRequest = GoproSetRequest;
