"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HilControls = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Sent from autopilot to simulation. Hardware in the loop control outputs
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// roll_ailerons Control output -1 .. 1 float
// pitch_elevator Control output -1 .. 1 float
// yaw_rudder Control output -1 .. 1 float
// throttle Throttle 0 .. 1 float
// aux1 Aux 1, -1 .. 1 float
// aux2 Aux 2, -1 .. 1 float
// aux3 Aux 3, -1 .. 1 float
// aux4 Aux 4, -1 .. 1 float
// mode System mode. uint8_t
// nav_mode Navigation mode (MAV_NAV_MODE) uint8_t
class HilControls extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 91;
        this._message_name = 'HIL_CONTROLS';
        this._crc_extra = 63;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['roll_ailerons', 'float', false],
            ['pitch_elevator', 'float', false],
            ['yaw_rudder', 'float', false],
            ['throttle', 'float', false],
            ['aux1', 'float', false],
            ['aux2', 'float', false],
            ['aux3', 'float', false],
            ['aux4', 'float', false],
            ['mode', 'uint8_t', false],
            ['nav_mode', 'uint8_t', false],
        ];
    }
}
exports.HilControls = HilControls;
