"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MountOrientation = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Orientation of a mount
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// roll Roll in global frame (set to NaN for invalid). float
// pitch Pitch in global frame (set to NaN for invalid). float
// yaw Yaw relative to vehicle (set to NaN for invalid). float
// yaw_absolute Yaw in absolute frame relative to Earth's North, north is 0 (set to NaN for invalid). float
class MountOrientation extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 265;
        this._message_name = 'MOUNT_ORIENTATION';
        this._crc_extra = 26;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['roll', 'float', false],
            ['pitch', 'float', false],
            ['yaw', 'float', false],
            ['yaw_absolute', 'float', true],
        ];
    }
}
exports.MountOrientation = MountOrientation;
