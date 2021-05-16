"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HilRcInputsRaw = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Sent from simulation to autopilot. The RAW values of the RC channels received. The standard PPM modulation is as follows: 1000 microseconds: 0%, 2000 microseconds: 100%. Individual receivers/transmitters might violate this specification.
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// chan1_raw RC channel 1 value uint16_t
// chan2_raw RC channel 2 value uint16_t
// chan3_raw RC channel 3 value uint16_t
// chan4_raw RC channel 4 value uint16_t
// chan5_raw RC channel 5 value uint16_t
// chan6_raw RC channel 6 value uint16_t
// chan7_raw RC channel 7 value uint16_t
// chan8_raw RC channel 8 value uint16_t
// chan9_raw RC channel 9 value uint16_t
// chan10_raw RC channel 10 value uint16_t
// chan11_raw RC channel 11 value uint16_t
// chan12_raw RC channel 12 value uint16_t
// rssi Receive signal strength indicator in device-dependent units/scale. Values: [0-254], 255: invalid/unknown. uint8_t
class HilRcInputsRaw extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 92;
        this._message_name = 'HIL_RC_INPUTS_RAW';
        this._crc_extra = 54;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['chan1_raw', 'uint16_t', false],
            ['chan2_raw', 'uint16_t', false],
            ['chan3_raw', 'uint16_t', false],
            ['chan4_raw', 'uint16_t', false],
            ['chan5_raw', 'uint16_t', false],
            ['chan6_raw', 'uint16_t', false],
            ['chan7_raw', 'uint16_t', false],
            ['chan8_raw', 'uint16_t', false],
            ['chan9_raw', 'uint16_t', false],
            ['chan10_raw', 'uint16_t', false],
            ['chan11_raw', 'uint16_t', false],
            ['chan12_raw', 'uint16_t', false],
            ['rssi', 'uint8_t', false],
        ];
    }
}
exports.HilRcInputsRaw = HilRcInputsRaw;
