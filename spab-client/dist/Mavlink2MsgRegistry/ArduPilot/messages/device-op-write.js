"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceOpWrite = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Write registers for a device.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// request_id Request ID - copied to reply. uint32_t
// bustype The bus type. uint8_t
// bus Bus number. uint8_t
// address Bus address. uint8_t
// busname Name of device on bus (for SPI). char
// regstart First register to write. uint8_t
// count Count of registers to write. uint8_t
// data Write data. uint8_t
// bank Bank number. uint8_t
class DeviceOpWrite extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11002;
        this._message_name = 'DEVICE_OP_WRITE';
        this._crc_extra = 234;
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
            ['data', 'uint8_t', false],
            ['bank', 'uint8_t', true],
        ];
    }
}
exports.DeviceOpWrite = DeviceOpWrite;
