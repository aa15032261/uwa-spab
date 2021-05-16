"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HilGps = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The global position, as returned by the Global Positioning System (GPS). This is
                 NOT the global position estimate of the sytem, but rather a RAW sensor value. See message GLOBAL_POSITION for the global position estimate.
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// fix_type 0-1: no fix, 2: 2D fix, 3: 3D fix. Some applications will not use the value of this field unless it is at least two, so always correctly fill in the fix. uint8_t
// lat Latitude (WGS84) int32_t
// lon Longitude (WGS84) int32_t
// alt Altitude (MSL). Positive for up. int32_t
// eph GPS HDOP horizontal dilution of position. If unknown, set to: 65535 uint16_t
// epv GPS VDOP vertical dilution of position. If unknown, set to: 65535 uint16_t
// vel GPS ground speed. If unknown, set to: 65535 uint16_t
// vn GPS velocity in north direction in earth-fixed NED frame int16_t
// ve GPS velocity in east direction in earth-fixed NED frame int16_t
// vd GPS velocity in down direction in earth-fixed NED frame int16_t
// cog Course over ground (NOT heading, but direction of movement), 0.0..359.99 degrees. If unknown, set to: 65535 uint16_t
// satellites_visible Number of satellites visible. If unknown, set to 255 uint8_t
class HilGps extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 113;
        this._message_name = 'HIL_GPS';
        this._crc_extra = 124;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['lat', 'int32_t', false],
            ['lon', 'int32_t', false],
            ['alt', 'int32_t', false],
            ['eph', 'uint16_t', false],
            ['epv', 'uint16_t', false],
            ['vel', 'uint16_t', false],
            ['vn', 'int16_t', false],
            ['ve', 'int16_t', false],
            ['vd', 'int16_t', false],
            ['cog', 'uint16_t', false],
            ['fix_type', 'uint8_t', false],
            ['satellites_visible', 'uint8_t', false],
        ];
    }
}
exports.HilGps = HilGps;
