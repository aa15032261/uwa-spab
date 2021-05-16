"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteLogDataBlock = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Send a block of log data to remote location.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// seqno Log data block sequence number. uint32_t
// data Log data block. uint8_t
class RemoteLogDataBlock extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 184;
        this._message_name = 'REMOTE_LOG_DATA_BLOCK';
        this._crc_extra = 159;
        this._message_fields = [
            ['seqno', 'uint32_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['data', 'uint8_t', false],
        ];
    }
}
exports.RemoteLogDataBlock = RemoteLogDataBlock;
