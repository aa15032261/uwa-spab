"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rpm = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
RPM sensor output.
*/
// rpm1 RPM Sensor1. float
// rpm2 RPM Sensor2. float
class Rpm extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 226;
        this._message_name = 'RPM';
        this._crc_extra = 207;
        this._message_fields = [
            ['rpm1', 'float', false],
            ['rpm2', 'float', false],
        ];
    }
}
exports.Rpm = Rpm;
