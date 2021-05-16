"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscTelemetry5To8 = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
ESC Telemetry Data for ESCs 5 to 8, matching data sent by BLHeli ESCs.
*/
// temperature Temperature. uint8_t
// voltage Voltage. uint16_t
// current Current. uint16_t
// totalcurrent Total current. uint16_t
// rpm RPM (eRPM). uint16_t
// count count of telemetry packets received (wraps at 65535). uint16_t
class EscTelemetry5To8 extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11031;
        this._message_name = 'ESC_TELEMETRY_5_TO_8';
        this._crc_extra = 133;
        this._message_fields = [
            ['voltage', 'uint16_t', false],
            ['current', 'uint16_t', false],
            ['totalcurrent', 'uint16_t', false],
            ['rpm', 'uint16_t', false],
            ['count', 'uint16_t', false],
            ['temperature', 'uint8_t', false],
        ];
    }
}
exports.EscTelemetry5To8 = EscTelemetry5To8;
