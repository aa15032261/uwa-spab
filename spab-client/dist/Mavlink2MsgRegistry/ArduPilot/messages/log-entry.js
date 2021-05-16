"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogEntry = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Reply to LOG_REQUEST_LIST
*/
// id Log id uint16_t
// num_logs Total number of logs uint16_t
// last_log_num High log number uint16_t
// time_utc UTC timestamp of log since 1970, or 0 if not available uint32_t
// size Size of the log (may be approximate) uint32_t
class LogEntry extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 118;
        this._message_name = 'LOG_ENTRY';
        this._crc_extra = 56;
        this._message_fields = [
            ['time_utc', 'uint32_t', false],
            ['size', 'uint32_t', false],
            ['id', 'uint16_t', false],
            ['num_logs', 'uint16_t', false],
            ['last_log_num', 'uint16_t', false],
        ];
    }
}
exports.LogEntry = LogEntry;
