"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistanceSensor = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Distance sensor information for an onboard rangefinder.
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// min_distance Minimum distance the sensor can measure uint16_t
// max_distance Maximum distance the sensor can measure uint16_t
// current_distance Current distance reading uint16_t
// type Type of distance sensor. uint8_t
// id Onboard ID of the sensor uint8_t
// orientation Direction the sensor faces. downward-facing: ROTATION_PITCH_270, upward-facing: ROTATION_PITCH_90, backward-facing: ROTATION_PITCH_180, forward-facing: ROTATION_NONE, left-facing: ROTATION_YAW_90, right-facing: ROTATION_YAW_270 uint8_t
// covariance Measurement variance. Max standard deviation is 6cm. 255 if unknown. uint8_t
// horizontal_fov Horizontal Field of View (angle) where the distance measurement is valid and the field of view is known. Otherwise this is set to 0. float
// vertical_fov Vertical Field of View (angle) where the distance measurement is valid and the field of view is known. Otherwise this is set to 0. float
// quaternion Quaternion of the sensor orientation in vehicle body frame (w, x, y, z order, zero-rotation is 1, 0, 0, 0). Zero-rotation is along the vehicle body x-axis. This field is required if the orientation is set to MAV_SENSOR_ROTATION_CUSTOM. Set it to 0 if invalid." float
class DistanceSensor extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 132;
        this._message_name = 'DISTANCE_SENSOR';
        this._crc_extra = 85;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['min_distance', 'uint16_t', false],
            ['max_distance', 'uint16_t', false],
            ['current_distance', 'uint16_t', false],
            ['type', 'uint8_t', false],
            ['id', 'uint8_t', false],
            ['orientation', 'uint8_t', false],
            ['covariance', 'uint8_t', false],
            ['horizontal_fov', 'float', true],
            ['vertical_fov', 'float', true],
            ['quaternion', 'float', true],
        ];
    }
}
exports.DistanceSensor = DistanceSensor;
