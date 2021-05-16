"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScaledImu = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The RAW IMU readings for the usual 9DOF sensor setup. This message should contain the scaled values to the described units
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// xacc X acceleration int16_t
// yacc Y acceleration int16_t
// zacc Z acceleration int16_t
// xgyro Angular speed around X axis int16_t
// ygyro Angular speed around Y axis int16_t
// zgyro Angular speed around Z axis int16_t
// xmag X Magnetic field int16_t
// ymag Y Magnetic field int16_t
// zmag Z Magnetic field int16_t
// temperature Temperature, 0: IMU does not provide temperature values. If the IMU is at 0C it must send 1 (0.01C). int16_t
class ScaledImu extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 26;
        this._message_name = 'SCALED_IMU';
        this._crc_extra = 170;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['xacc', 'int16_t', false],
            ['yacc', 'int16_t', false],
            ['zacc', 'int16_t', false],
            ['xgyro', 'int16_t', false],
            ['ygyro', 'int16_t', false],
            ['zgyro', 'int16_t', false],
            ['xmag', 'int16_t', false],
            ['ymag', 'int16_t', false],
            ['zmag', 'int16_t', false],
            ['temperature', 'int16_t', true],
        ];
    }
}
exports.ScaledImu = ScaledImu;
