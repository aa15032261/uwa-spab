"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawPressure = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The RAW pressure readings for the typical setup of one absolute pressure and one differential pressure sensor. The sensor values should be the raw, UNSCALED ADC values.
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// press_abs Absolute pressure (raw) int16_t
// press_diff1 Differential pressure 1 (raw, 0 if nonexistent) int16_t
// press_diff2 Differential pressure 2 (raw, 0 if nonexistent) int16_t
// temperature Raw Temperature measurement (raw) int16_t
class RawPressure extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 28;
        this._message_name = 'RAW_PRESSURE';
        this._crc_extra = 67;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['press_abs', 'int16_t', false],
            ['press_diff1', 'int16_t', false],
            ['press_diff2', 'int16_t', false],
            ['temperature', 'int16_t', false],
        ];
    }
}
exports.RawPressure = RawPressure;
