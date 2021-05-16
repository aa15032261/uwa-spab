"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MountConfigure = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Message to configure a camera mount, directional antenna, etc.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// mount_mode Mount operating mode. uint8_t
// stab_roll (1 = yes, 0 = no). uint8_t
// stab_pitch (1 = yes, 0 = no). uint8_t
// stab_yaw (1 = yes, 0 = no). uint8_t
class MountConfigure extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 156;
        this._message_name = 'MOUNT_CONFIGURE';
        this._crc_extra = 19;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['mount_mode', 'uint8_t', false],
            ['stab_roll', 'uint8_t', false],
            ['stab_pitch', 'uint8_t', false],
            ['stab_yaw', 'uint8_t', false],
        ];
    }
}
exports.MountConfigure = MountConfigure;
