"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteLogBlockStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Send Status of each log block that autopilot board might have sent.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// seqno Log data block sequence number. uint32_t
// status Log data block status. uint8_t
class RemoteLogBlockStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 185;
        this._message_name = 'REMOTE_LOG_BLOCK_STATUS';
        this._crc_extra = 186;
        this._message_fields = [
            ['seqno', 'uint32_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['status', 'uint8_t', false],
        ];
    }
}
exports.RemoteLogBlockStatus = RemoteLogBlockStatus;
