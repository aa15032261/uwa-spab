"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraInformation = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Information about a camera
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// vendor_name Name of the camera vendor uint8_t
// model_name Name of the camera model uint8_t
// firmware_version Version of the camera firmware (v << 24 & 0xff = Dev, v << 16 & 0xff = Patch, v << 8 & 0xff = Minor, v & 0xff = Major) uint32_t
// focal_length Focal length float
// sensor_size_h Image sensor size horizontal float
// sensor_size_v Image sensor size vertical float
// resolution_h Horizontal image resolution uint16_t
// resolution_v Vertical image resolution uint16_t
// lens_id Reserved for a lens ID uint8_t
// flags Bitmap of camera capability flags. uint32_t
// cam_definition_version Camera definition version (iteration) uint16_t
// cam_definition_uri Camera definition URI (if any, otherwise only basic functions will be available). HTTP- (http://) and MAVLink FTP- (mavlinkftp://) formatted URIs are allowed (and both must be supported by any GCS that implements the Camera Protocol). char
class CameraInformation extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 259;
        this._message_name = 'CAMERA_INFORMATION';
        this._crc_extra = 92;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['firmware_version', 'uint32_t', false],
            ['focal_length', 'float', false],
            ['sensor_size_h', 'float', false],
            ['sensor_size_v', 'float', false],
            ['flags', 'uint32_t', false],
            ['resolution_h', 'uint16_t', false],
            ['resolution_v', 'uint16_t', false],
            ['cam_definition_version', 'uint16_t', false],
            ['vendor_name', 'uint8_t', false],
            ['model_name', 'uint8_t', false],
            ['lens_id', 'uint8_t', false],
            ['cam_definition_uri', 'char', false],
        ];
    }
}
exports.CameraInformation = CameraInformation;
