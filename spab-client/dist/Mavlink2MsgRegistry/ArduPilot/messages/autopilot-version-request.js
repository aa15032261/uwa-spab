"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutopilotVersionRequest = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request the autopilot version from the system/component.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
class AutopilotVersionRequest extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 183;
        this._message_name = 'AUTOPILOT_VERSION_REQUEST';
        this._crc_extra = 85;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.AutopilotVersionRequest = AutopilotVersionRequest;
