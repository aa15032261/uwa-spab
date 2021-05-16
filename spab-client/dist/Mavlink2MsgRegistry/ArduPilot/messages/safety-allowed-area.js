"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyAllowedArea = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Read out the safety zone the MAV currently assumes.
*/
// frame Coordinate frame. Can be either global, GPS, right-handed with Z axis up or local, right handed, Z axis down. uint8_t
// p1x x position 1 / Latitude 1 float
// p1y y position 1 / Longitude 1 float
// p1z z position 1 / Altitude 1 float
// p2x x position 2 / Latitude 2 float
// p2y y position 2 / Longitude 2 float
// p2z z position 2 / Altitude 2 float
class SafetyAllowedArea extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 55;
        this._message_name = 'SAFETY_ALLOWED_AREA';
        this._crc_extra = 3;
        this._message_fields = [
            ['p1x', 'float', false],
            ['p1y', 'float', false],
            ['p1z', 'float', false],
            ['p2x', 'float', false],
            ['p2y', 'float', false],
            ['p2z', 'float', false],
            ['frame', 'uint8_t', false],
        ];
    }
}
exports.SafetyAllowedArea = SafetyAllowedArea;
