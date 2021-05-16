"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagCalProgress = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Reports progress of compass calibration.
*/
// compass_id Compass being calibrated. uint8_t
// cal_mask Bitmask of compasses being calibrated. uint8_t
// cal_status Calibration Status. uint8_t
// attempt Attempt number. uint8_t
// completion_pct Completion percentage. uint8_t
// completion_mask Bitmask of sphere sections (see http://en.wikipedia.org/wiki/Geodesic_grid). uint8_t
// direction_x Body frame direction vector for display. float
// direction_y Body frame direction vector for display. float
// direction_z Body frame direction vector for display. float
class MagCalProgress extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 191;
        this._message_name = 'MAG_CAL_PROGRESS';
        this._crc_extra = 92;
        this._message_fields = [
            ['direction_x', 'float', false],
            ['direction_y', 'float', false],
            ['direction_z', 'float', false],
            ['compass_id', 'uint8_t', false],
            ['cal_mask', 'uint8_t', false],
            ['cal_status', 'uint8_t', false],
            ['attempt', 'uint8_t', false],
            ['completion_pct', 'uint8_t', false],
            ['completion_mask', 'uint8_t', false],
        ];
    }
}
exports.MagCalProgress = MagCalProgress;
