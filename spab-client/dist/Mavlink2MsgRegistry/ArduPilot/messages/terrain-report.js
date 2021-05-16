"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerrainReport = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Response from a TERRAIN_CHECK request
*/
// lat Latitude int32_t
// lon Longitude int32_t
// spacing grid spacing (zero if terrain at this location unavailable) uint16_t
// terrain_height Terrain height MSL float
// current_height Current vehicle height above lat/lon terrain height float
// pending Number of 4x4 terrain blocks waiting to be received or read from disk uint16_t
// loaded Number of 4x4 terrain blocks in memory uint16_t
class TerrainReport extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 136;
        this._message_name = 'TERRAIN_REPORT';
        this._crc_extra = 1;
        this._message_fields = [
            ['lat', 'int32_t', false],
            ['lon', 'int32_t', false],
            ['terrain_height', 'float', false],
            ['current_height', 'float', false],
            ['spacing', 'uint16_t', false],
            ['pending', 'uint16_t', false],
            ['loaded', 'uint16_t', false],
        ];
    }
}
exports.TerrainReport = TerrainReport;
