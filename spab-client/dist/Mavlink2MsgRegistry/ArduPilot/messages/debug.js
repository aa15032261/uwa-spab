"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Send a debug value. The index is used to discriminate between values. These values show up in the plot of QGroundControl as DEBUG N.
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// ind index of debug variable uint8_t
// value DEBUG value float
class Debug extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 254;
        this._message_name = 'DEBUG';
        this._crc_extra = 46;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['value', 'float', false],
            ['ind', 'uint8_t', false],
        ];
    }
}
exports.Debug = Debug;
