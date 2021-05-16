"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisionPositionDelta = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Camera vision based attitude and position deltas.
*/
// time_usec Timestamp (synced to UNIX time or since system boot). uint64_t
// time_delta_usec Time since the last reported camera frame. uint64_t
// angle_delta Defines a rotation vector in body frame that rotates the vehicle from the previous to the current orientation. float
// position_delta Change in position from previous to current frame rotated into body frame (0=forward, 1=right, 2=down). float
// confidence Normalised confidence value from 0 to 100. float
class VisionPositionDelta extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11011;
        this._message_name = 'VISION_POSITION_DELTA';
        this._crc_extra = 106;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['time_delta_usec', 'uint64_t', false],
            ['angle_delta', 'float', false],
            ['position_delta', 'float', false],
            ['confidence', 'float', false],
        ];
    }
}
exports.VisionPositionDelta = VisionPositionDelta;
