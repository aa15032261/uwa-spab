"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Camera Event.
*/
// time_usec Image timestamp (since UNIX epoch, according to camera clock). uint64_t
// target_system System ID. uint8_t
// cam_idx Camera ID. uint8_t
// img_idx Image index. uint16_t
// event_id Event type. uint8_t
// p1 Parameter 1 (meaning depends on event_id, see CAMERA_STATUS_TYPES enum). float
// p2 Parameter 2 (meaning depends on event_id, see CAMERA_STATUS_TYPES enum). float
// p3 Parameter 3 (meaning depends on event_id, see CAMERA_STATUS_TYPES enum). float
// p4 Parameter 4 (meaning depends on event_id, see CAMERA_STATUS_TYPES enum). float
class CameraStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 179;
        this._message_name = 'CAMERA_STATUS';
        this._crc_extra = 189;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['p1', 'float', false],
            ['p2', 'float', false],
            ['p3', 'float', false],
            ['p4', 'float', false],
            ['img_idx', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['cam_idx', 'uint8_t', false],
            ['event_id', 'uint8_t', false],
        ];
    }
}
exports.CameraStatus = CameraStatus;
