"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugFloatArray = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Large debug/prototyping array. The message uses the maximum available payload for data. The array_id and name fields are used to discriminate between messages in code and in user interfaces (respectively). Do not use in production code.
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// name Name, for human-friendly display in a Ground Control Station char
// array_id Unique ID used to discriminate between arrays uint16_t
// data data float
class DebugFloatArray extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 350;
        this._message_name = 'DEBUG_FLOAT_ARRAY';
        this._crc_extra = 232;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['array_id', 'uint16_t', false],
            ['name', 'char', false],
            ['data', 'float', true],
        ];
    }
}
exports.DebugFloatArray = DebugFloatArray;
