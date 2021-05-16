"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraCaptureStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Information about the status of a capture.
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// image_status Current status of image capturing (0: idle, 1: capture in progress, 2: interval set but idle, 3: interval set and capture in progress) uint8_t
// video_status Current status of video capturing (0: idle, 1: capture in progress) uint8_t
// image_interval Image capture interval float
// recording_time_ms Time since recording started uint32_t
// available_capacity Available storage capacity. float
class CameraCaptureStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 262;
        this._message_name = 'CAMERA_CAPTURE_STATUS';
        this._crc_extra = 12;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['image_interval', 'float', false],
            ['recording_time_ms', 'uint32_t', false],
            ['available_capacity', 'float', false],
            ['image_status', 'uint8_t', false],
            ['video_status', 'uint8_t', false],
        ];
    }
}
exports.CameraCaptureStatus = CameraCaptureStatus;
