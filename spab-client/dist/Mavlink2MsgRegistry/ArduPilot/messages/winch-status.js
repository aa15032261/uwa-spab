"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinchStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Winch status.
*/
// time_usec Timestamp (synced to UNIX time or since system boot). uint64_t
// line_length Length of line released. NaN if unknown float
// speed Speed line is being released or retracted. Positive values if being released, negative values if being retracted, NaN if unknown float
// tension Tension on the line. NaN if unknown float
// voltage Voltage of the battery supplying the winch. NaN if unknown float
// current Current draw from the winch. NaN if unknown float
// temperature Temperature of the motor. INT16_MAX if unknown int16_t
// status Status flags uint32_t
class WinchStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 9005;
        this._message_name = 'WINCH_STATUS';
        this._crc_extra = 117;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['line_length', 'float', false],
            ['speed', 'float', false],
            ['tension', 'float', false],
            ['voltage', 'float', false],
            ['current', 'float', false],
            ['status', 'uint32_t', false],
            ['temperature', 'int16_t', false],
        ];
    }
}
exports.WinchStatus = WinchStatus;
