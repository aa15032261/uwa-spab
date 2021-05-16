"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FencePoint = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
A fence point. Used to set a point when from GCS -> MAV. Also used to return a point from MAV -> GCS.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// idx Point index (first point is 1, 0 is for return point). uint8_t
// count Total number of points (for sanity checking). uint8_t
// lat Latitude of point. float
// lng Longitude of point. float
class FencePoint extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 160;
        this._message_name = 'FENCE_POINT';
        this._crc_extra = 78;
        this._message_fields = [
            ['lat', 'float', false],
            ['lng', 'float', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['idx', 'uint8_t', false],
            ['count', 'uint8_t', false],
        ];
    }
}
exports.FencePoint = FencePoint;
