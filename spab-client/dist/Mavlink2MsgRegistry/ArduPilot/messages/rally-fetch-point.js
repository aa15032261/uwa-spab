"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RallyFetchPoint = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request a current rally point from MAV. MAV should respond with a RALLY_POINT message. MAV should not respond if the request is invalid.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// idx Point index (first point is 0). uint8_t
class RallyFetchPoint extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 176;
        this._message_name = 'RALLY_FETCH_POINT';
        this._crc_extra = 234;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['idx', 'uint8_t', false],
        ];
    }
}
exports.RallyFetchPoint = RallyFetchPoint;
