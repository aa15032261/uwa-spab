"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GpsInjectData = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Data for injecting into the onboard GPS (used for DGPS)
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// len Data length uint8_t
// data Raw data (110 is enough for 12 satellites of RTCMv2) uint8_t
class GpsInjectData extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 123;
        this._message_name = 'GPS_INJECT_DATA';
        this._crc_extra = 250;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['len', 'uint8_t', false],
            ['data', 'uint8_t', false],
        ];
    }
}
exports.GpsInjectData = GpsInjectData;
