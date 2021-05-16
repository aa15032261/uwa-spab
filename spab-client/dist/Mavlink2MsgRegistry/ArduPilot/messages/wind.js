"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wind = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Wind estimation.
*/
// direction Wind direction (that wind is coming from). float
// speed Wind speed in ground plane. float
// speed_z Vertical wind speed. float
class Wind extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 168;
        this._message_name = 'WIND';
        this._crc_extra = 1;
        this._message_fields = [
            ['direction', 'float', false],
            ['speed', 'float', false],
            ['speed_z', 'float', false],
        ];
    }
}
exports.Wind = Wind;
