"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindCov = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Wind covariance estimate from vehicle.
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// wind_x Wind in X (NED) direction float
// wind_y Wind in Y (NED) direction float
// wind_z Wind in Z (NED) direction float
// var_horiz Variability of the wind in XY. RMS of a 1 Hz lowpassed wind estimate. float
// var_vert Variability of the wind in Z. RMS of a 1 Hz lowpassed wind estimate. float
// wind_alt Altitude (MSL) that this measurement was taken at float
// horiz_accuracy Horizontal speed 1-STD accuracy float
// vert_accuracy Vertical speed 1-STD accuracy float
class WindCov extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 231;
        this._message_name = 'WIND_COV';
        this._crc_extra = 105;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['wind_x', 'float', false],
            ['wind_y', 'float', false],
            ['wind_z', 'float', false],
            ['var_horiz', 'float', false],
            ['var_vert', 'float', false],
            ['wind_alt', 'float', false],
            ['horiz_accuracy', 'float', false],
            ['vert_accuracy', 'float', false],
        ];
    }
}
exports.WindCov = WindCov;
