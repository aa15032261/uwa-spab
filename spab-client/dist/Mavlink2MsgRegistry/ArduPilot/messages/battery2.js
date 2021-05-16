"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battery2 = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
2nd Battery status
*/
// voltage Voltage. uint16_t
// current_battery Battery current, -1: autopilot does not measure the current. int16_t
class Battery2 extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 181;
        this._message_name = 'BATTERY2';
        this._crc_extra = 174;
        this._message_fields = [
            ['voltage', 'uint16_t', false],
            ['current_battery', 'int16_t', false],
        ];
    }
}
exports.Battery2 = Battery2;
