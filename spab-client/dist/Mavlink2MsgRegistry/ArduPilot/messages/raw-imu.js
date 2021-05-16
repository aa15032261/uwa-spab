"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawImu = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The RAW IMU readings for a 9DOF sensor, which is identified by the id (default IMU1). This message should always contain the true raw values without any scaling to allow data capture and system debugging.
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// xacc X acceleration (raw) int16_t
// yacc Y acceleration (raw) int16_t
// zacc Z acceleration (raw) int16_t
// xgyro Angular speed around X axis (raw) int16_t
// ygyro Angular speed around Y axis (raw) int16_t
// zgyro Angular speed around Z axis (raw) int16_t
// xmag X Magnetic field (raw) int16_t
// ymag Y Magnetic field (raw) int16_t
// zmag Z Magnetic field (raw) int16_t
// id Id. Ids are numbered from 0 and map to IMUs numbered from 1 (e.g. IMU1 will have a message with id=0) uint8_t
// temperature Temperature, 0: IMU does not provide temperature values. If the IMU is at 0C it must send 1 (0.01C). int16_t
class RawImu extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 27;
        this._message_name = 'RAW_IMU';
        this._crc_extra = 144;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['xacc', 'int16_t', false],
            ['yacc', 'int16_t', false],
            ['zacc', 'int16_t', false],
            ['xgyro', 'int16_t', false],
            ['ygyro', 'int16_t', false],
            ['zgyro', 'int16_t', false],
            ['xmag', 'int16_t', false],
            ['ymag', 'int16_t', false],
            ['zmag', 'int16_t', false],
            ['id', 'uint8_t', true],
            ['temperature', 'int16_t', true],
        ];
    }
}
exports.RawImu = RawImu;
