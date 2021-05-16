"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RallyPoint = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
A rally point. Used to set a point when from GCS -> MAV. Also used to return a point from MAV -> GCS.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// idx Point index (first point is 0). uint8_t
// count Total number of points (for sanity checking). uint8_t
// lat Latitude of point. int32_t
// lng Longitude of point. int32_t
// alt Transit / loiter altitude relative to home. int16_t
// break_alt Break altitude relative to home. int16_t
// land_dir Heading to aim for when landing. uint16_t
// flags Configuration flags. uint8_t
class RallyPoint extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 175;
        this._message_name = 'RALLY_POINT';
        this._crc_extra = 138;
        this._message_fields = [
            ['lat', 'int32_t', false],
            ['lng', 'int32_t', false],
            ['alt', 'int16_t', false],
            ['break_alt', 'int16_t', false],
            ['land_dir', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['idx', 'uint8_t', false],
            ['count', 'uint8_t', false],
            ['flags', 'uint8_t', false],
        ];
    }
}
exports.RallyPoint = RallyPoint;
