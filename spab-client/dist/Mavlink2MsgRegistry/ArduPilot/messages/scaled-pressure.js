"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScaledPressure = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The pressure readings for the typical setup of one absolute and differential pressure sensor. The units are as specified in each field.
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// press_abs Absolute pressure float
// press_diff Differential pressure 1 float
// temperature Absolute pressure temperature int16_t
// temperature_press_diff Differential pressure temperature int16_t
class ScaledPressure extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 29;
        this._message_name = 'SCALED_PRESSURE';
        this._crc_extra = 115;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['press_abs', 'float', false],
            ['press_diff', 'float', false],
            ['temperature', 'int16_t', false],
            ['temperature_press_diff', 'int16_t', true],
        ];
    }
}
exports.ScaledPressure = ScaledPressure;
