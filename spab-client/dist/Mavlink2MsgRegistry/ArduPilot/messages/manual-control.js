"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualControl = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
This message provides an API for manually controlling the vehicle using standard joystick axes nomenclature, along with a joystick-like input device. Unused axes can be disabled an buttons are also transmit as boolean values of their
*/
// target The system to be controlled. uint8_t
// x X-axis, normalized to the range [-1000,1000]. A value of INT16_MAX indicates that this axis is invalid. Generally corresponds to forward(1000)-backward(-1000) movement on a joystick and the pitch of a vehicle. int16_t
// y Y-axis, normalized to the range [-1000,1000]. A value of INT16_MAX indicates that this axis is invalid. Generally corresponds to left(-1000)-right(1000) movement on a joystick and the roll of a vehicle. int16_t
// z Z-axis, normalized to the range [-1000,1000]. A value of INT16_MAX indicates that this axis is invalid. Generally corresponds to a separate slider movement with maximum being 1000 and minimum being -1000 on a joystick and the thrust of a vehicle. Positive values are positive thrust, negative values are negative thrust. int16_t
// r R-axis, normalized to the range [-1000,1000]. A value of INT16_MAX indicates that this axis is invalid. Generally corresponds to a twisting of the joystick, with counter-clockwise being 1000 and clockwise being -1000, and the yaw of a vehicle. int16_t
// buttons A bitfield corresponding to the joystick buttons' current state, 1 for pressed, 0 for released. The lowest bit corresponds to Button 1. uint16_t
class ManualControl extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 69;
        this._message_name = 'MANUAL_CONTROL';
        this._crc_extra = 243;
        this._message_fields = [
            ['x', 'int16_t', false],
            ['y', 'int16_t', false],
            ['z', 'int16_t', false],
            ['r', 'int16_t', false],
            ['buttons', 'uint16_t', false],
            ['target', 'uint8_t', false],
        ];
    }
}
exports.ManualControl = ManualControl;
