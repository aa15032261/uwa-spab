"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MountStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Message with some status from APM to GCS about camera or antenna mount.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// pointing_a Pitch. int32_t
// pointing_b Roll. int32_t
// pointing_c Yaw. int32_t
class MountStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 158;
        this._message_name = 'MOUNT_STATUS';
        this._crc_extra = 134;
        this._message_fields = [
            ['pointing_a', 'int32_t', false],
            ['pointing_b', 'int32_t', false],
            ['pointing_c', 'int32_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.MountStatus = MountStatus;
