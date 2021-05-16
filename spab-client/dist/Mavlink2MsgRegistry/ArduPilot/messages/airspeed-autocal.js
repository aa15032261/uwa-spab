"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirspeedAutocal = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Airspeed auto-calibration.
*/
// vx GPS velocity north. float
// vy GPS velocity east. float
// vz GPS velocity down. float
// diff_pressure Differential pressure. float
// EAS2TAS Estimated to true airspeed ratio. float
// ratio Airspeed ratio. float
// state_x EKF state x. float
// state_y EKF state y. float
// state_z EKF state z. float
// Pax EKF Pax. float
// Pby EKF Pby. float
// Pcz EKF Pcz. float
class AirspeedAutocal extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 174;
        this._message_name = 'AIRSPEED_AUTOCAL';
        this._crc_extra = 167;
        this._message_fields = [
            ['vx', 'float', false],
            ['vy', 'float', false],
            ['vz', 'float', false],
            ['diff_pressure', 'float', false],
            ['EAS2TAS', 'float', false],
            ['ratio', 'float', false],
            ['state_x', 'float', false],
            ['state_y', 'float', false],
            ['state_z', 'float', false],
            ['Pax', 'float', false],
            ['Pby', 'float', false],
            ['Pcz', 'float', false],
        ];
    }
}
exports.AirspeedAutocal = AirspeedAutocal;
