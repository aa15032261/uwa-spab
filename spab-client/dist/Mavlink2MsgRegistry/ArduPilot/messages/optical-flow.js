"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpticalFlow = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Optical flow from a flow sensor (e.g. optical mouse sensor)
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// sensor_id Sensor ID uint8_t
// flow_x Flow in x-sensor direction int16_t
// flow_y Flow in y-sensor direction int16_t
// flow_comp_m_x Flow in x-sensor direction, angular-speed compensated float
// flow_comp_m_y Flow in y-sensor direction, angular-speed compensated float
// quality Optical flow quality / confidence. 0: bad, 255: maximum quality uint8_t
// ground_distance Ground distance. Positive value: distance known. Negative value: Unknown distance float
// flow_rate_x Flow rate about X axis float
// flow_rate_y Flow rate about Y axis float
class OpticalFlow extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 100;
        this._message_name = 'OPTICAL_FLOW';
        this._crc_extra = 175;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['flow_comp_m_x', 'float', false],
            ['flow_comp_m_y', 'float', false],
            ['ground_distance', 'float', false],
            ['flow_x', 'int16_t', false],
            ['flow_y', 'int16_t', false],
            ['sensor_id', 'uint8_t', false],
            ['quality', 'uint8_t', false],
            ['flow_rate_x', 'float', true],
            ['flow_rate_y', 'float', true],
        ];
    }
}
exports.OpticalFlow = OpticalFlow;
