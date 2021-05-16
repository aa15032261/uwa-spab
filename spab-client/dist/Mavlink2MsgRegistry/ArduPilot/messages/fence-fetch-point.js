"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FenceFetchPoint = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request a current fence point from MAV.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// idx Point index (first point is 1, 0 is for return point). uint8_t
class FenceFetchPoint extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 161;
        this._message_name = 'FENCE_FETCH_POINT';
        this._crc_extra = 68;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['idx', 'uint8_t', false],
        ];
    }
}
exports.FenceFetchPoint = FenceFetchPoint;
