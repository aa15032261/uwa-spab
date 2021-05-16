"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RcChannelsScaled = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The scaled values of the RC channels received: (-100%) -10000, (0%) 0, (100%) 10000. Channels that are inactive should be set to UINT16_MAX.
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// port Servo output port (set of 8 outputs = 1 port). Flight stacks running on Pixhawk should use: 0 = MAIN, 1 = AUX. uint8_t
// chan1_scaled RC channel 1 value scaled. int16_t
// chan2_scaled RC channel 2 value scaled. int16_t
// chan3_scaled RC channel 3 value scaled. int16_t
// chan4_scaled RC channel 4 value scaled. int16_t
// chan5_scaled RC channel 5 value scaled. int16_t
// chan6_scaled RC channel 6 value scaled. int16_t
// chan7_scaled RC channel 7 value scaled. int16_t
// chan8_scaled RC channel 8 value scaled. int16_t
// rssi Receive signal strength indicator in device-dependent units/scale. Values: [0-254], 255: invalid/unknown. uint8_t
class RcChannelsScaled extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 34;
        this._message_name = 'RC_CHANNELS_SCALED';
        this._crc_extra = 237;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['chan1_scaled', 'int16_t', false],
            ['chan2_scaled', 'int16_t', false],
            ['chan3_scaled', 'int16_t', false],
            ['chan4_scaled', 'int16_t', false],
            ['chan5_scaled', 'int16_t', false],
            ['chan6_scaled', 'int16_t', false],
            ['chan7_scaled', 'int16_t', false],
            ['chan8_scaled', 'int16_t', false],
            ['port', 'uint8_t', false],
            ['rssi', 'uint8_t', false],
        ];
    }
}
exports.RcChannelsScaled = RcChannelsScaled;
