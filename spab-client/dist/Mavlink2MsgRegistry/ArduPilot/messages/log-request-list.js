"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRequestList = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request a list of available logs. On some systems calling this may stop on-board logging until LOG_REQUEST_END is called.
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// start First log id (0 for first available) uint16_t
// end Last log id (0xffff for last available) uint16_t
class LogRequestList extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 117;
        this._message_name = 'LOG_REQUEST_LIST';
        this._crc_extra = 128;
        this._message_fields = [
            ['start', 'uint16_t', false],
            ['end', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.LogRequestList = LogRequestList;
