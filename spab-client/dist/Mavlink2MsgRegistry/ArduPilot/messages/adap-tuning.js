"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapTuning = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Adaptive Controller tuning information.
*/
// axis Axis. uint8_t
// desired Desired rate. float
// achieved Achieved rate. float
// error Error between model and vehicle. float
// theta Theta estimated state predictor. float
// omega Omega estimated state predictor. float
// sigma Sigma estimated state predictor. float
// theta_dot Theta derivative. float
// omega_dot Omega derivative. float
// sigma_dot Sigma derivative. float
// f Projection operator value. float
// f_dot Projection operator derivative. float
// u u adaptive controlled output command. float
class AdapTuning extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11010;
        this._message_name = 'ADAP_TUNING';
        this._crc_extra = 46;
        this._message_fields = [
            ['desired', 'float', false],
            ['achieved', 'float', false],
            ['error', 'float', false],
            ['theta', 'float', false],
            ['omega', 'float', false],
            ['sigma', 'float', false],
            ['theta_dot', 'float', false],
            ['omega_dot', 'float', false],
            ['sigma_dot', 'float', false],
            ['f', 'float', false],
            ['f_dot', 'float', false],
            ['u', 'float', false],
            ['axis', 'uint8_t', false],
        ];
    }
}
exports.AdapTuning = AdapTuning;
