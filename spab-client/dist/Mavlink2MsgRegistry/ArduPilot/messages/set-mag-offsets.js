"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetMagOffsets = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Set the magnetometer offsets
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// mag_ofs_x Magnetometer X offset. int16_t
// mag_ofs_y Magnetometer Y offset. int16_t
// mag_ofs_z Magnetometer Z offset. int16_t
class SetMagOffsets extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 151;
        this._message_name = 'SET_MAG_OFFSETS';
        this._crc_extra = 219;
        this._message_fields = [
            ['mag_ofs_x', 'int16_t', false],
            ['mag_ofs_y', 'int16_t', false],
            ['mag_ofs_z', 'int16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.SetMagOffsets = SetMagOffsets;
