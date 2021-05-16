"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rangefinder = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Rangefinder reporting.
*/
// distance Distance. float
// voltage Raw voltage if available, zero otherwise. float
class Rangefinder extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 173;
        this._message_name = 'RANGEFINDER';
        this._crc_extra = 83;
        this._message_fields = [
            ['distance', 'float', false],
            ['voltage', 'float', false],
        ];
    }
}
exports.Rangefinder = Rangefinder;
