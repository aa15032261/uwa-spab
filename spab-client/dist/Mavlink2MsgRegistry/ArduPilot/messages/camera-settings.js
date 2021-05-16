"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraSettings = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Settings of a camera, can be requested using MAV_CMD_REQUEST_CAMERA_SETTINGS.
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// mode_id Camera mode uint8_t
// zoomLevel Current zoom level (0.0 to 100.0, NaN if not known) float
// focusLevel Current focus level (0.0 to 100.0, NaN if not known) float
class CameraSettings extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 260;
        this._message_name = 'CAMERA_SETTINGS';
        this._crc_extra = 146;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['mode_id', 'uint8_t', false],
            ['zoomLevel', 'float', true],
            ['focusLevel', 'float', true],
        ];
    }
}
exports.CameraSettings = CameraSettings;
