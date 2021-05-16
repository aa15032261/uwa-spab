"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HilSensor = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The IMU readings in SI units in NED body frame
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// xacc X acceleration float
// yacc Y acceleration float
// zacc Z acceleration float
// xgyro Angular speed around X axis in body frame float
// ygyro Angular speed around Y axis in body frame float
// zgyro Angular speed around Z axis in body frame float
// xmag X Magnetic field float
// ymag Y Magnetic field float
// zmag Z Magnetic field float
// abs_pressure Absolute pressure float
// diff_pressure Differential pressure (airspeed) float
// pressure_alt Altitude calculated from pressure float
// temperature Temperature float
// fields_updated Bitmap for fields that have updated since last message, bit 0 = xacc, bit 12: temperature, bit 31: full reset of attitude/position/velocities/etc was performed in sim. uint32_t
class HilSensor extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 107;
        this._message_name = 'HIL_SENSOR';
        this._crc_extra = 108;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['xacc', 'float', false],
            ['yacc', 'float', false],
            ['zacc', 'float', false],
            ['xgyro', 'float', false],
            ['ygyro', 'float', false],
            ['zgyro', 'float', false],
            ['xmag', 'float', false],
            ['ymag', 'float', false],
            ['zmag', 'float', false],
            ['abs_pressure', 'float', false],
            ['diff_pressure', 'float', false],
            ['pressure_alt', 'float', false],
            ['temperature', 'float', false],
            ['fields_updated', 'uint32_t', false],
        ];
    }
}
exports.HilSensor = HilSensor;
