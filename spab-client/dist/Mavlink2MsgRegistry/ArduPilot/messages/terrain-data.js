"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerrainData = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Terrain data sent from GCS. The lat/lon and grid_spacing must be the same as a lat/lon from a TERRAIN_REQUEST
*/
// lat Latitude of SW corner of first grid int32_t
// lon Longitude of SW corner of first grid int32_t
// grid_spacing Grid spacing uint16_t
// gridbit bit within the terrain request mask uint8_t
// data Terrain data MSL int16_t
class TerrainData extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 134;
        this._message_name = 'TERRAIN_DATA';
        this._crc_extra = 229;
        this._message_fields = [
            ['lat', 'int32_t', false],
            ['lon', 'int32_t', false],
            ['grid_spacing', 'uint16_t', false],
            ['data', 'int16_t', false],
            ['gridbit', 'uint8_t', false],
        ];
    }
}
exports.TerrainData = TerrainData;
