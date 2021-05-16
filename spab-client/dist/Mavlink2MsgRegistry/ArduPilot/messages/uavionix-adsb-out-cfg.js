"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UavionixAdsbOutCfg = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Static data to configure the ADS-B transponder (send within 10 sec of a POR and every 10 sec thereafter)
*/
// ICAO Vehicle address (24 bit) uint32_t
// callsign Vehicle identifier (8 characters, null terminated, valid characters are A-Z, 0-9, " " only) char
// emitterType Transmitting vehicle type. See ADSB_EMITTER_TYPE enum uint8_t
// aircraftSize Aircraft length and width encoding (table 2-35 of DO-282B) uint8_t
// gpsOffsetLat GPS antenna lateral offset (table 2-36 of DO-282B) uint8_t
// gpsOffsetLon GPS antenna longitudinal offset from nose [if non-zero, take position (in meters) divide by 2 and add one] (table 2-37 DO-282B) uint8_t
// stallSpeed Aircraft stall speed in cm/s uint16_t
// rfSelect ADS-B transponder reciever and transmit enable flags uint8_t
class UavionixAdsbOutCfg extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 10001;
        this._message_name = 'UAVIONIX_ADSB_OUT_CFG';
        this._crc_extra = 209;
        this._message_fields = [
            ['ICAO', 'uint32_t', false],
            ['stallSpeed', 'uint16_t', false],
            ['callsign', 'char', false],
            ['emitterType', 'uint8_t', false],
            ['aircraftSize', 'uint8_t', false],
            ['gpsOffsetLat', 'uint8_t', false],
            ['gpsOffsetLon', 'uint8_t', false],
            ['rfSelect', 'uint8_t', false],
        ];
    }
}
exports.UavionixAdsbOutCfg = UavionixAdsbOutCfg;
