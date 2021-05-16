"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActuatorOutputStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The raw values of the actuator outputs (e.g. on Pixhawk, from MAIN, AUX ports). This message supersedes SERVO_OUTPUT_RAW.
*/
// time_usec Timestamp (since system boot). uint64_t
// active Active outputs uint32_t
// actuator Servo / motor output array values. Zero values indicate unused channels. float
class ActuatorOutputStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 375;
        this._message_name = 'ACTUATOR_OUTPUT_STATUS';
        this._crc_extra = 251;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['active', 'uint32_t', false],
            ['actuator', 'float', false],
        ];
    }
}
exports.ActuatorOutputStatus = ActuatorOutputStatus;
