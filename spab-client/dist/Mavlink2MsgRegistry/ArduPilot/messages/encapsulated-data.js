"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncapsulatedData = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Data packet for images sent using the Image Transmission Protocol: https://mavlink.io/en/services/image_transmission.html.
*/
// seqnr sequence number (starting with 0 on every transmission) uint16_t
// data image data bytes uint8_t
class EncapsulatedData extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 131;
        this._message_name = 'ENCAPSULATED_DATA';
        this._crc_extra = 223;
        this._message_fields = [
            ['seqnr', 'uint16_t', false],
            ['data', 'uint8_t', false],
        ];
    }
}
exports.EncapsulatedData = EncapsulatedData;
