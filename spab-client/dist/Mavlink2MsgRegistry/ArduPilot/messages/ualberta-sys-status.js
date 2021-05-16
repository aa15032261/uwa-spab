"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UalbertaSysStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
System status specific to ualberta uav
*/
// mode System mode, see UALBERTA_AUTOPILOT_MODE ENUM uint8_t
// nav_mode Navigation mode, see UALBERTA_NAV_MODE ENUM uint8_t
// pilot Pilot mode, see UALBERTA_PILOT_MODE uint8_t
class UalbertaSysStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 222;
        this._message_name = 'UALBERTA_SYS_STATUS';
        this._crc_extra = 15;
        this._message_fields = [
            ['mode', 'uint8_t', false],
            ['nav_mode', 'uint8_t', false],
            ['pilot', 'uint8_t', false],
        ];
    }
}
exports.UalbertaSysStatus = UalbertaSysStatus;
