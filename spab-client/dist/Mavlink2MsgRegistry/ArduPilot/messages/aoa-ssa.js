"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoaSsa = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Angle of Attack and Side Slip Angle.
*/
// time_usec Timestamp (since boot or Unix epoch). uint64_t
// AOA Angle of Attack. float
// SSA Side Slip Angle. float
class AoaSsa extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11020;
        this._message_name = 'AOA_SSA';
        this._crc_extra = 205;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['AOA', 'float', false],
            ['SSA', 'float', false],
        ];
    }
}
exports.AoaSsa = AoaSsa;
