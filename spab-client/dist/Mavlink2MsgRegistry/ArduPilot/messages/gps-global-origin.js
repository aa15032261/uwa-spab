"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GpsGlobalOrigin = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Publishes the GPS co-ordinates of the vehicle local origin (0,0,0) position. Emitted whenever a new GPS-Local position mapping is requested or set - e.g. following SET_GPS_GLOBAL_ORIGIN message.
*/
// latitude Latitude (WGS84) int32_t
// longitude Longitude (WGS84) int32_t
// altitude Altitude (MSL). Positive for up. int32_t
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
class GpsGlobalOrigin extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 49;
        this._message_name = 'GPS_GLOBAL_ORIGIN';
        this._crc_extra = 39;
        this._message_fields = [
            ['latitude', 'int32_t', false],
            ['longitude', 'int32_t', false],
            ['altitude', 'int32_t', false],
            ['time_usec', 'uint64_t', true],
        ];
    }
}
exports.GpsGlobalOrigin = GpsGlobalOrigin;
