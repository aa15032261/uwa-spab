"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AisVessel = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The location and information of an AIS vessel
*/
// MMSI Mobile Marine Service Identifier, 9 decimal digits uint32_t
// lat Latitude int32_t
// lon Longitude int32_t
// COG Course over ground uint16_t
// heading True heading uint16_t
// velocity Speed over ground uint16_t
// turn_rate Turn rate int8_t
// navigational_status Navigational status uint8_t
// type Type of vessels uint8_t
// dimension_bow Distance from lat/lon location to bow uint16_t
// dimension_stern Distance from lat/lon location to stern uint16_t
// dimension_port Distance from lat/lon location to port side uint8_t
// dimension_starboard Distance from lat/lon location to starboard side uint8_t
// callsign The vessel callsign char
// name The vessel name char
// tslc Time since last communication in seconds uint16_t
// flags Bitmask to indicate various statuses including valid data fields uint16_t
class AisVessel extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 301;
        this._message_name = 'AIS_VESSEL';
        this._crc_extra = 243;
        this._message_fields = [
            ['MMSI', 'uint32_t', false],
            ['lat', 'int32_t', false],
            ['lon', 'int32_t', false],
            ['COG', 'uint16_t', false],
            ['heading', 'uint16_t', false],
            ['velocity', 'uint16_t', false],
            ['dimension_bow', 'uint16_t', false],
            ['dimension_stern', 'uint16_t', false],
            ['tslc', 'uint16_t', false],
            ['flags', 'uint16_t', false],
            ['turn_rate', 'int8_t', false],
            ['navigational_status', 'uint8_t', false],
            ['type', 'uint8_t', false],
            ['dimension_port', 'uint8_t', false],
            ['dimension_starboard', 'uint8_t', false],
            ['callsign', 'char', false],
            ['name', 'char', false],
        ];
    }
}
exports.AisVessel = AisVessel;
