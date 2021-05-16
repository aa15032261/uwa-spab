"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timesync = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Time synchronization message.
*/
// tc1 Time sync timestamp 1 int64_t
// ts1 Time sync timestamp 2 int64_t
class Timesync extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 111;
        this._message_name = 'TIMESYNC';
        this._crc_extra = 34;
        this._message_fields = [
            ['tc1', 'int64_t', false],
            ['ts1', 'int64_t', false],
        ];
    }
}
exports.Timesync = Timesync;
