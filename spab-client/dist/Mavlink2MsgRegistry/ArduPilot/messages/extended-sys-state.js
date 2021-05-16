"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedSysState = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Provides state for additional features
*/
// vtol_state The VTOL state if applicable. Is set to MAV_VTOL_STATE_UNDEFINED if UAV is not in VTOL configuration. uint8_t
// landed_state The landed state. Is set to MAV_LANDED_STATE_UNDEFINED if landed state is unknown. uint8_t
class ExtendedSysState extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 245;
        this._message_name = 'EXTENDED_SYS_STATE';
        this._crc_extra = 130;
        this._message_fields = [
            ['vtol_state', 'uint8_t', false],
            ['landed_state', 'uint8_t', false],
        ];
    }
}
exports.ExtendedSysState = ExtendedSysState;
