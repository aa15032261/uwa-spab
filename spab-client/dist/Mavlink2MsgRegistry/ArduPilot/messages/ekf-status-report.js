"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EkfStatusReport = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
EKF Status message including flags and variances.
*/
// flags Flags. uint16_t
// velocity_variance Velocity variance. float
// pos_horiz_variance Horizontal Position variance. float
// pos_vert_variance Vertical Position variance. float
// compass_variance Compass variance. float
// terrain_alt_variance Terrain Altitude variance. float
// airspeed_variance Airspeed variance. float
class EkfStatusReport extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 193;
        this._message_name = 'EKF_STATUS_REPORT';
        this._crc_extra = 71;
        this._message_fields = [
            ['velocity_variance', 'float', false],
            ['pos_horiz_variance', 'float', false],
            ['pos_vert_variance', 'float', false],
            ['compass_variance', 'float', false],
            ['terrain_alt_variance', 'float', false],
            ['flags', 'uint16_t', false],
            ['airspeed_variance', 'float', true],
        ];
    }
}
exports.EkfStatusReport = EkfStatusReport;
