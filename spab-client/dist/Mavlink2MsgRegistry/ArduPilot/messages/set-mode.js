"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetMode = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Set the system mode, as defined by enum MAV_MODE. There is no target component id as the mode is by definition for the overall aircraft, not only for one component.
*/
// target_system The system setting the mode uint8_t
// base_mode The new base mode. uint8_t
// custom_mode The new autopilot-specific mode. This field can be ignored by an autopilot. uint32_t
class SetMode extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11;
        this._message_name = 'SET_MODE';
        this._crc_extra = 89;
        this._message_fields = [
            ['custom_mode', 'uint32_t', false],
            ['target_system', 'uint8_t', false],
            ['base_mode', 'uint8_t', false],
        ];
    }
}
exports.SetMode = SetMode;
