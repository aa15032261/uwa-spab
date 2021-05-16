"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PidTuning = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
PID tuning information.
*/
// axis Axis. uint8_t
// desired Desired rate. float
// achieved Achieved rate. float
// FF FF component. float
// P P component. float
// I I component. float
// D D component. float
class PidTuning extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 194;
        this._message_name = 'PID_TUNING';
        this._crc_extra = 98;
        this._message_fields = [
            ['desired', 'float', false],
            ['achieved', 'float', false],
            ['FF', 'float', false],
            ['P', 'float', false],
            ['I', 'float', false],
            ['D', 'float', false],
            ['axis', 'uint8_t', false],
        ];
    }
}
exports.PidTuning = PidTuning;
