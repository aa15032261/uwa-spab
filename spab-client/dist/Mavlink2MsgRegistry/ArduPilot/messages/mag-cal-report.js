"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagCalReport = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Reports results of completed compass calibration. Sent until MAG_CAL_ACK received.
*/
// compass_id Compass being calibrated. uint8_t
// cal_mask Bitmask of compasses being calibrated. uint8_t
// cal_status Calibration Status. uint8_t
// autosaved 0=requires a MAV_CMD_DO_ACCEPT_MAG_CAL, 1=saved to parameters. uint8_t
// fitness RMS milligauss residuals. float
// ofs_x X offset. float
// ofs_y Y offset. float
// ofs_z Z offset. float
// diag_x X diagonal (matrix 11). float
// diag_y Y diagonal (matrix 22). float
// diag_z Z diagonal (matrix 33). float
// offdiag_x X off-diagonal (matrix 12 and 21). float
// offdiag_y Y off-diagonal (matrix 13 and 31). float
// offdiag_z Z off-diagonal (matrix 32 and 23). float
// orientation_confidence Confidence in orientation (higher is better). float
// old_orientation orientation before calibration. uint8_t
// new_orientation orientation after calibration. uint8_t
// scale_factor field radius correction factor float
class MagCalReport extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 192;
        this._message_name = 'MAG_CAL_REPORT';
        this._crc_extra = 36;
        this._message_fields = [
            ['fitness', 'float', false],
            ['ofs_x', 'float', false],
            ['ofs_y', 'float', false],
            ['ofs_z', 'float', false],
            ['diag_x', 'float', false],
            ['diag_y', 'float', false],
            ['diag_z', 'float', false],
            ['offdiag_x', 'float', false],
            ['offdiag_y', 'float', false],
            ['offdiag_z', 'float', false],
            ['compass_id', 'uint8_t', false],
            ['cal_mask', 'uint8_t', false],
            ['cal_status', 'uint8_t', false],
            ['autosaved', 'uint8_t', false],
            ['orientation_confidence', 'float', true],
            ['old_orientation', 'uint8_t', true],
            ['new_orientation', 'uint8_t', true],
            ['scale_factor', 'float', true],
        ];
    }
}
exports.MagCalReport = MagCalReport;
