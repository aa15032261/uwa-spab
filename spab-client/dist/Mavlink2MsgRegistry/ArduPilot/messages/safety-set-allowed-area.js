"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetySetAllowedArea = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Set a safety zone (volume), which is defined by two corners of a cube. This message can be used to tell the MAV which setpoints/waypoints to accept and which to reject. Safety areas are often enforced by national or competition regulations.
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// frame Coordinate frame. Can be either global, GPS, right-handed with Z axis up or local, right handed, Z axis down. uint8_t
// p1x x position 1 / Latitude 1 float
// p1y y position 1 / Longitude 1 float
// p1z z position 1 / Altitude 1 float
// p2x x position 2 / Latitude 2 float
// p2y y position 2 / Longitude 2 float
// p2z z position 2 / Altitude 2 float
class SafetySetAllowedArea extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 54;
        this._message_name = 'SAFETY_SET_ALLOWED_AREA';
        this._crc_extra = 15;
        this._message_fields = [
            ['p1x', 'float', false],
            ['p1y', 'float', false],
            ['p1z', 'float', false],
            ['p2x', 'float', false],
            ['p2y', 'float', false],
            ['p2z', 'float', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['frame', 'uint8_t', false],
        ];
    }
}
exports.SafetySetAllowedArea = SafetySetAllowedArea;
