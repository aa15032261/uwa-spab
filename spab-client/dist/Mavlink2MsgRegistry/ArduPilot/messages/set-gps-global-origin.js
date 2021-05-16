"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetGpsGlobalOrigin = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Sets the GPS co-ordinates of the vehicle local origin (0,0,0) position. Vehicle should emit GPS_GLOBAL_ORIGIN irrespective of whether the origin is changed. This enables transform between the local coordinate frame and the global (GPS) coordinate frame, which may be necessary when (for example) indoor and outdoor settings are connected and the MAV should move from in- to outdoor.
*/
// target_system System ID uint8_t
// latitude Latitude (WGS84) int32_t
// longitude Longitude (WGS84) int32_t
// altitude Altitude (MSL). Positive for up. int32_t
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
class SetGpsGlobalOrigin extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 48;
        this._message_name = 'SET_GPS_GLOBAL_ORIGIN';
        this._crc_extra = 41;
        this._message_fields = [
            ['latitude', 'int32_t', false],
            ['longitude', 'int32_t', false],
            ['altitude', 'int32_t', false],
            ['target_system', 'uint8_t', false],
            ['time_usec', 'uint64_t', true],
        ];
    }
}
exports.SetGpsGlobalOrigin = SetGpsGlobalOrigin;
