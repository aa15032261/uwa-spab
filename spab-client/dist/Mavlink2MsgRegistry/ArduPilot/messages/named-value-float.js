"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedValueFloat = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Send a key-value pair as float. The use of this message is discouraged for normal packets, but a quite efficient way for testing new messages and getting experimental debug output.
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// name Name of the debug variable char
// value Floating point value float
class NamedValueFloat extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 251;
        this._message_name = 'NAMED_VALUE_FLOAT';
        this._crc_extra = 170;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['value', 'float', false],
            ['name', 'char', false],
        ];
    }
}
exports.NamedValueFloat = NamedValueFloat;
