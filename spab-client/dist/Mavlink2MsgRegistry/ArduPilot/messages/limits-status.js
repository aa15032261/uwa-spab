"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitsStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Status of AP_Limits. Sent in extended status stream when AP_Limits is enabled.
*/
// limits_state State of AP_Limits. uint8_t
// last_trigger Time (since boot) of last breach. uint32_t
// last_action Time (since boot) of last recovery action. uint32_t
// last_recovery Time (since boot) of last successful recovery. uint32_t
// last_clear Time (since boot) of last all-clear. uint32_t
// breach_count Number of fence breaches. uint16_t
// mods_enabled AP_Limit_Module bitfield of enabled modules. uint8_t
// mods_required AP_Limit_Module bitfield of required modules. uint8_t
// mods_triggered AP_Limit_Module bitfield of triggered modules. uint8_t
class LimitsStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 167;
        this._message_name = 'LIMITS_STATUS';
        this._crc_extra = 144;
        this._message_fields = [
            ['last_trigger', 'uint32_t', false],
            ['last_action', 'uint32_t', false],
            ['last_recovery', 'uint32_t', false],
            ['last_clear', 'uint32_t', false],
            ['breach_count', 'uint16_t', false],
            ['limits_state', 'uint8_t', false],
            ['mods_enabled', 'uint8_t', false],
            ['mods_required', 'uint8_t', false],
            ['mods_triggered', 'uint8_t', false],
        ];
    }
}
exports.LimitsStatus = LimitsStatus;
