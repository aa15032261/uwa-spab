"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerrainCheck = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request that the vehicle report terrain height at the given location. Used by GCS to check if vehicle has all terrain data needed for a mission.
*/
// lat Latitude int32_t
// lon Longitude int32_t
class TerrainCheck extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 135;
        this._message_name = 'TERRAIN_CHECK';
        this._crc_extra = 203;
        this._message_fields = [
            ['lat', 'int32_t', false],
            ['lon', 'int32_t', false],
        ];
    }
}
exports.TerrainCheck = TerrainCheck;
