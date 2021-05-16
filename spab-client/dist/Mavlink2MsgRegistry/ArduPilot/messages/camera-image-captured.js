"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraImageCaptured = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Information about a captured image
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// time_utc Timestamp (time since UNIX epoch) in UTC. 0 for unknown. uint64_t
// camera_id Camera ID (1 for first, 2 for second, etc.) uint8_t
// lat Latitude where image was taken int32_t
// lon Longitude where capture was taken int32_t
// alt Altitude (MSL) where image was taken int32_t
// relative_alt Altitude above ground int32_t
// q Quaternion of camera orientation (w, x, y, z order, zero-rotation is 0, 0, 0, 0) float
// image_index Zero based index of this image (image count since armed -1) int32_t
// capture_result Boolean indicating success (1) or failure (0) while capturing this image. int8_t
// file_url URL of image taken. Either local storage or http://foo.jpg if camera provides an HTTP interface. char
class CameraImageCaptured extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 263;
        this._message_name = 'CAMERA_IMAGE_CAPTURED';
        this._crc_extra = 133;
        this._message_fields = [
            ['time_utc', 'uint64_t', false],
            ['time_boot_ms', 'uint32_t', false],
            ['lat', 'int32_t', false],
            ['lon', 'int32_t', false],
            ['alt', 'int32_t', false],
            ['relative_alt', 'int32_t', false],
            ['q', 'float', false],
            ['image_index', 'int32_t', false],
            ['camera_id', 'uint8_t', false],
            ['capture_result', 'int8_t', false],
            ['file_url', 'char', false],
        ];
    }
}
exports.CameraImageCaptured = CameraImageCaptured;
