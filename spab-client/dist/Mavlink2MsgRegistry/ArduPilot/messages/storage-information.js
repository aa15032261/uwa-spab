"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageInformation = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Information about a storage medium. This message is sent in response to a request and whenever the status of the storage changes (STORAGE_STATUS).
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// storage_id Storage ID (1 for first, 2 for second, etc.) uint8_t
// storage_count Number of storage devices uint8_t
// status Status of storage uint8_t
// total_capacity Total capacity. If storage is not ready (STORAGE_STATUS_READY) value will be ignored. float
// used_capacity Used capacity. If storage is not ready (STORAGE_STATUS_READY) value will be ignored. float
// available_capacity Available storage capacity. If storage is not ready (STORAGE_STATUS_READY) value will be ignored. float
// read_speed Read speed. float
// write_speed Write speed. float
class StorageInformation extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 261;
        this._message_name = 'STORAGE_INFORMATION';
        this._crc_extra = 179;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['total_capacity', 'float', false],
            ['used_capacity', 'float', false],
            ['available_capacity', 'float', false],
            ['read_speed', 'float', false],
            ['write_speed', 'float', false],
            ['storage_id', 'uint8_t', false],
            ['storage_count', 'uint8_t', false],
            ['status', 'uint8_t', false],
        ];
    }
}
exports.StorageInformation = StorageInformation;
