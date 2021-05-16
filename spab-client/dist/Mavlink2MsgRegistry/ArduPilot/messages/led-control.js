"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedControl = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Control vehicle LEDs.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// instance Instance (LED instance to control or 255 for all LEDs). uint8_t
// pattern Pattern (see LED_PATTERN_ENUM). uint8_t
// custom_len Custom Byte Length. uint8_t
// custom_bytes Custom Bytes. uint8_t
class LedControl extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 186;
        this._message_name = 'LED_CONTROL';
        this._crc_extra = 72;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['instance', 'uint8_t', false],
            ['pattern', 'uint8_t', false],
            ['custom_len', 'uint8_t', false],
            ['custom_bytes', 'uint8_t', false],
        ];
    }
}
exports.LedControl = LedControl;
