"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceOpRead = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Read registers for a device.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// request_id Request ID - copied to reply. uint32_t
// bustype The bus type. uint8_t
// bus Bus number. uint8_t
// address Bus address. uint8_t
// busname Name of device on bus (for SPI). char
// regstart First register to read. uint8_t
// count Count of registers to read. uint8_t
// bank Bank number. uint8_t
class DeviceOpRead extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11000;
        this._message_name = 'DEVICE_OP_READ';
        this._crc_extra = 134;
        this._message_fields = [
            ['request_id', 'uint32_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['bustype', 'uint8_t', false],
            ['bus', 'uint8_t', false],
            ['address', 'uint8_t', false],
            ['busname', 'char', false],
            ['regstart', 'uint8_t', false],
            ['count', 'uint8_t', false],
            ['bank', 'uint8_t', true],
        ];
    }
}
exports.DeviceOpRead = DeviceOpRead;
