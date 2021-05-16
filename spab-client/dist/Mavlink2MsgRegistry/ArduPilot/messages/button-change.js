"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonChange = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Report button state change.
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// last_change_ms Time of last change of button state. uint32_t
// state Bitmap for state of buttons. uint8_t
class ButtonChange extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 257;
        this._message_name = 'BUTTON_CHANGE';
        this._crc_extra = 131;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['last_change_ms', 'uint32_t', false],
            ['state', 'uint8_t', false],
        ];
    }
}
exports.ButtonChange = ButtonChange;
