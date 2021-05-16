"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogErase = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Erase all logs
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
class LogErase extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 121;
        this._message_name = 'LOG_ERASE';
        this._crc_extra = 237;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.LogErase = LogErase;
