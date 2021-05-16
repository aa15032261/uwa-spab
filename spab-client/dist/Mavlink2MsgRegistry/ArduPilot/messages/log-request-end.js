"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRequestEnd = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Stop log transfer and resume normal logging
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
class LogRequestEnd extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 122;
        this._message_name = 'LOG_REQUEST_END';
        this._crc_extra = 203;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.LogRequestEnd = LogRequestEnd;
