"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedValueInt = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Send a key-value pair as integer. The use of this message is discouraged for normal packets, but a quite efficient way for testing new messages and getting experimental debug output.
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// name Name of the debug variable char
// value Signed integer value int32_t
class NamedValueInt extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 252;
        this._message_name = 'NAMED_VALUE_INT';
        this._crc_extra = 44;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['value', 'int32_t', false],
            ['name', 'char', false],
        ];
    }
}
exports.NamedValueInt = NamedValueInt;
