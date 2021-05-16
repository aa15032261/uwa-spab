"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VfrHud = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Metrics typically displayed on a HUD for fixed wing aircraft.
*/
// airspeed Current indicated airspeed (IAS). float
// groundspeed Current ground speed. float
// heading Current heading in compass units (0-360, 0=north). int16_t
// throttle Current throttle setting (0 to 100). uint16_t
// alt Current altitude (MSL). float
// climb Current climb rate. float
class VfrHud extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 74;
        this._message_name = 'VFR_HUD';
        this._crc_extra = 20;
        this._message_fields = [
            ['airspeed', 'float', false],
            ['groundspeed', 'float', false],
            ['alt', 'float', false],
            ['climb', 'float', false],
            ['heading', 'int16_t', false],
            ['throttle', 'uint16_t', false],
        ];
    }
}
exports.VfrHud = VfrHud;
