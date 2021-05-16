"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GpsRtcmData = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
RTCM message for injecting into the onboard GPS (used for DGPS)
*/
// flags LSB: 1 means message is fragmented, next 2 bits are the fragment ID, the remaining 5 bits are used for the sequence ID. Messages are only to be flushed to the GPS when the entire message has been reconstructed on the autopilot. The fragment ID specifies which order the fragments should be assembled into a buffer, while the sequence ID is used to detect a mismatch between different buffers. The buffer is considered fully reconstructed when either all 4 fragments are present, or all the fragments before the first fragment with a non full payload is received. This management is used to ensure that normal GPS operation doesn't corrupt RTCM data, and to recover from a unreliable transport delivery order. uint8_t
// len data length uint8_t
// data RTCM message (may be fragmented) uint8_t
class GpsRtcmData extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 233;
        this._message_name = 'GPS_RTCM_DATA';
        this._crc_extra = 35;
        this._message_fields = [
            ['flags', 'uint8_t', false],
            ['len', 'uint8_t', false],
            ['data', 'uint8_t', false],
        ];
    }
}
exports.GpsRtcmData = GpsRtcmData;
