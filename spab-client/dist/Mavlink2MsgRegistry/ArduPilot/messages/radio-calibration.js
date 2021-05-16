"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioCalibration = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Complete set of calibration parameters for the radio
*/
// aileron Aileron setpoints: left, center, right uint16_t
// elevator Elevator setpoints: nose down, center, nose up uint16_t
// rudder Rudder setpoints: nose left, center, nose right uint16_t
// gyro Tail gyro mode/gain setpoints: heading hold, rate mode uint16_t
// pitch Pitch curve setpoints (every 25%) uint16_t
// throttle Throttle curve setpoints (every 25%) uint16_t
class RadioCalibration extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 221;
        this._message_name = 'RADIO_CALIBRATION';
        this._crc_extra = 71;
        this._message_fields = [
            ['aileron', 'uint16_t', false],
            ['elevator', 'uint16_t', false],
            ['rudder', 'uint16_t', false],
            ['gyro', 'uint16_t', false],
            ['pitch', 'uint16_t', false],
            ['throttle', 'uint16_t', false],
        ];
    }
}
exports.RadioCalibration = RadioCalibration;
