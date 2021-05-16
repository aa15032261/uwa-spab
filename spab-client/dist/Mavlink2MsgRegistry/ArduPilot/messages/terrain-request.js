"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerrainRequest = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request for terrain data and terrain status
*/
// lat Latitude of SW corner of first grid int32_t
// lon Longitude of SW corner of first grid int32_t
// grid_spacing Grid spacing uint16_t
// mask Bitmask of requested 4x4 grids (row major 8x7 array of grids, 56 bits) uint64_t
class TerrainRequest extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 133;
        this._message_name = 'TERRAIN_REQUEST';
        this._crc_extra = 6;
        this._message_fields = [
            ['mask', 'uint64_t', false],
            ['lat', 'int32_t', false],
            ['lon', 'int32_t', false],
            ['grid_spacing', 'uint16_t', false],
        ];
    }
}
exports.TerrainRequest = TerrainRequest;
