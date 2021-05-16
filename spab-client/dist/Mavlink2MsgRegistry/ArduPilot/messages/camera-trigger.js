"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraTrigger = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Camera-IMU triggering and synchronisation message.
*/
// time_usec Timestamp for image frame (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// seq Image frame sequence uint32_t
class CameraTrigger extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 112;
        this._message_name = 'CAMERA_TRIGGER';
        this._crc_extra = 174;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['seq', 'uint32_t', false],
        ];
    }
}
exports.CameraTrigger = CameraTrigger;
