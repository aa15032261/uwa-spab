"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRequestData = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request a chunk of a log
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// id Log id (from LOG_ENTRY reply) uint16_t
// ofs Offset into the log uint32_t
// count Number of bytes uint32_t
class LogRequestData extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 119;
        this._message_name = 'LOG_REQUEST_DATA';
        this._crc_extra = 116;
        this._message_fields = [
            ['ofs', 'uint32_t', false],
            ['count', 'uint32_t', false],
            ['id', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.LogRequestData = LogRequestData;
