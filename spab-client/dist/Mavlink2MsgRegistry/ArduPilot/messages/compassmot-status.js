"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompassmotStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Status of compassmot calibration.
*/
// throttle Throttle. uint16_t
// current Current. float
// interference Interference. uint16_t
// CompensationX Motor Compensation X. float
// CompensationY Motor Compensation Y. float
// CompensationZ Motor Compensation Z. float
class CompassmotStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 177;
        this._message_name = 'COMPASSMOT_STATUS';
        this._crc_extra = 240;
        this._message_fields = [
            ['current', 'float', false],
            ['CompensationX', 'float', false],
            ['CompensationY', 'float', false],
            ['CompensationZ', 'float', false],
            ['throttle', 'uint16_t', false],
            ['interference', 'uint16_t', false],
        ];
    }
}
exports.CompassmotStatus = CompassmotStatus;
