"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorOffsets = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Offsets and calibrations values for hardware sensors. This makes it easier to debug the calibration process.
*/
// mag_ofs_x Magnetometer X offset. int16_t
// mag_ofs_y Magnetometer Y offset. int16_t
// mag_ofs_z Magnetometer Z offset. int16_t
// mag_declination Magnetic declination. float
// raw_press Raw pressure from barometer. int32_t
// raw_temp Raw temperature from barometer. int32_t
// gyro_cal_x Gyro X calibration. float
// gyro_cal_y Gyro Y calibration. float
// gyro_cal_z Gyro Z calibration. float
// accel_cal_x Accel X calibration. float
// accel_cal_y Accel Y calibration. float
// accel_cal_z Accel Z calibration. float
class SensorOffsets extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 150;
        this._message_name = 'SENSOR_OFFSETS';
        this._crc_extra = 134;
        this._message_fields = [
            ['mag_declination', 'float', false],
            ['raw_press', 'int32_t', false],
            ['raw_temp', 'int32_t', false],
            ['gyro_cal_x', 'float', false],
            ['gyro_cal_y', 'float', false],
            ['gyro_cal_z', 'float', false],
            ['accel_cal_x', 'float', false],
            ['accel_cal_y', 'float', false],
            ['accel_cal_z', 'float', false],
            ['mag_ofs_x', 'int16_t', false],
            ['mag_ofs_y', 'int16_t', false],
            ['mag_ofs_z', 'int16_t', false],
        ];
    }
}
exports.SensorOffsets = SensorOffsets;
