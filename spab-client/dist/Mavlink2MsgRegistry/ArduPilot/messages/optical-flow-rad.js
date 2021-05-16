"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpticalFlowRad = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Optical flow from an angular rate flow sensor (e.g. PX4FLOW or mouse sensor)
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// sensor_id Sensor ID uint8_t
// integration_time_us Integration time. Divide integrated_x and integrated_y by the integration time to obtain average flow. The integration time also indicates the. uint32_t
// integrated_x Flow around X axis (Sensor RH rotation about the X axis induces a positive flow. Sensor linear motion along the positive Y axis induces a negative flow.) float
// integrated_y Flow around Y axis (Sensor RH rotation about the Y axis induces a positive flow. Sensor linear motion along the positive X axis induces a positive flow.) float
// integrated_xgyro RH rotation around X axis float
// integrated_ygyro RH rotation around Y axis float
// integrated_zgyro RH rotation around Z axis float
// temperature Temperature int16_t
// quality Optical flow quality / confidence. 0: no valid flow, 255: maximum quality uint8_t
// time_delta_distance_us Time since the distance was sampled. uint32_t
// distance Distance to the center of the flow field. Positive value (including zero): distance known. Negative value: Unknown distance. float
class OpticalFlowRad extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 106;
        this._message_name = 'OPTICAL_FLOW_RAD';
        this._crc_extra = 138;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['integration_time_us', 'uint32_t', false],
            ['integrated_x', 'float', false],
            ['integrated_y', 'float', false],
            ['integrated_xgyro', 'float', false],
            ['integrated_ygyro', 'float', false],
            ['integrated_zgyro', 'float', false],
            ['time_delta_distance_us', 'uint32_t', false],
            ['distance', 'float', false],
            ['temperature', 'int16_t', false],
            ['sensor_id', 'uint8_t', false],
            ['quality', 'uint8_t', false],
        ];
    }
}
exports.OpticalFlowRad = OpticalFlowRad;
