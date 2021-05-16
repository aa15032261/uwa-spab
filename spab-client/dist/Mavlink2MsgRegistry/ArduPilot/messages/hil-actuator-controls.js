"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HilActuatorControls = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Sent from autopilot to simulation. Hardware in the loop control outputs (replacement for HIL_CONTROLS)
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// controls Control outputs -1 .. 1. Channel assignment depends on the simulated hardware. float
// mode System mode. Includes arming state. uint8_t
// flags Flags as bitfield, 1: indicate simulation using lockstep. uint64_t
class HilActuatorControls extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 93;
        this._message_name = 'HIL_ACTUATOR_CONTROLS';
        this._crc_extra = 47;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['flags', 'uint64_t', false],
            ['controls', 'float', false],
            ['mode', 'uint8_t', false],
        ];
    }
}
exports.HilActuatorControls = HilActuatorControls;
