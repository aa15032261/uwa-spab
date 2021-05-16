"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogData = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Reply to LOG_REQUEST_DATA
*/
// id Log id (from LOG_ENTRY reply) uint16_t
// ofs Offset into the log uint32_t
// count Number of bytes (zero for end of log) uint8_t
// data log data uint8_t
class LogData extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 120;
        this._message_name = 'LOG_DATA';
        this._crc_extra = 134;
        this._message_fields = [
            ['ofs', 'uint32_t', false],
            ['id', 'uint16_t', false],
            ['count', 'uint8_t', false],
            ['data', 'uint8_t', false],
        ];
    }
}
exports.LogData = LogData;
