"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meminfo = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
State of APM memory.
*/
// brkval Heap top. uint16_t
// freemem Free memory. uint16_t
// freemem32 Free memory (32 bit). uint32_t
class Meminfo extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 152;
        this._message_name = 'MEMINFO';
        this._crc_extra = 208;
        this._message_fields = [
            ['brkval', 'uint16_t', false],
            ['freemem', 'uint16_t', false],
            ['freemem32', 'uint32_t', true],
        ];
    }
}
exports.Meminfo = Meminfo;
