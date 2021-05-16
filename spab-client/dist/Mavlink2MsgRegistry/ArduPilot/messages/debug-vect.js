"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugVect = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
To debug something using a named 3D vector.
*/
// name Name char
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// x x float
// y y float
// z z float
class DebugVect extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 250;
        this._message_name = 'DEBUG_VECT';
        this._crc_extra = 49;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['x', 'float', false],
            ['y', 'float', false],
            ['z', 'float', false],
            ['name', 'char', false],
        ];
    }
}
exports.DebugVect = DebugVect;
