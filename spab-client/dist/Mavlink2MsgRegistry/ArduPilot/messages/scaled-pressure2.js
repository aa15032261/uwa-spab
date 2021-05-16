"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScaledPressure2 = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Barometer readings for 2nd barometer
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// press_abs Absolute pressure float
// press_diff Differential pressure float
// temperature Absolute pressure temperature int16_t
// temperature_press_diff Differential pressure temperature int16_t
class ScaledPressure2 extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 137;
        this._message_name = 'SCALED_PRESSURE2';
        this._crc_extra = 195;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['press_abs', 'float', false],
            ['press_diff', 'float', false],
            ['temperature', 'int16_t', false],
            ['temperature_press_diff', 'int16_t', true],
        ];
    }
}
exports.ScaledPressure2 = ScaledPressure2;
