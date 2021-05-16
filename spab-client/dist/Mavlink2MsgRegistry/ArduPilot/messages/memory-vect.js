"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryVect = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Send raw controller memory. The use of this message is discouraged for normal packets, but a quite efficient way for testing new messages and getting experimental debug output.
*/
// address Starting address of the debug variables uint16_t
// ver Version code of the type variable. 0=unknown, type ignored and assumed int16_t. 1=as below uint8_t
// type Type code of the memory variables. for ver = 1: 0=16 x int16_t, 1=16 x uint16_t, 2=16 x Q15, 3=16 x 1Q14 uint8_t
// value Memory contents at specified address int8_t
class MemoryVect extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 249;
        this._message_name = 'MEMORY_VECT';
        this._crc_extra = 204;
        this._message_fields = [
            ['address', 'uint16_t', false],
            ['ver', 'uint8_t', false],
            ['type', 'uint8_t', false],
            ['value', 'int8_t', false],
        ];
    }
}
exports.MemoryVect = MemoryVect;
