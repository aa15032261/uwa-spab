"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MountControl = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Message to control a camera mount, directional antenna, etc.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// input_a Pitch (centi-degrees) or lat (degE7), depending on mount mode. int32_t
// input_b Roll (centi-degrees) or lon (degE7) depending on mount mode. int32_t
// input_c Yaw (centi-degrees) or alt (cm) depending on mount mode. int32_t
// save_position If "1" it will save current trimmed position on EEPROM (just valid for NEUTRAL and LANDING). uint8_t
class MountControl extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 157;
        this._message_name = 'MOUNT_CONTROL';
        this._crc_extra = 21;
        this._message_fields = [
            ['input_a', 'int32_t', false],
            ['input_b', 'int32_t', false],
            ['input_c', 'int32_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['save_position', 'uint8_t', false],
        ];
    }
}
exports.MountControl = MountControl;
