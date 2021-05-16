"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTransmissionHandshake = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Handshake message to initiate, control and stop image streaming when using the Image Transmission Protocol: https://mavlink.io/en/services/image_transmission.html.
*/
// type Type of requested/acknowledged data. uint8_t
// size total data size (set on ACK only). uint32_t
// width Width of a matrix or image. uint16_t
// height Height of a matrix or image. uint16_t
// packets Number of packets being sent (set on ACK only). uint16_t
// payload Payload size per packet (normally 253 byte, see DATA field size in message ENCAPSULATED_DATA) (set on ACK only). uint8_t
// jpg_quality JPEG quality. Values: [1-100]. uint8_t
class DataTransmissionHandshake extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 130;
        this._message_name = 'DATA_TRANSMISSION_HANDSHAKE';
        this._crc_extra = 29;
        this._message_fields = [
            ['size', 'uint32_t', false],
            ['width', 'uint16_t', false],
            ['height', 'uint16_t', false],
            ['packets', 'uint16_t', false],
            ['type', 'uint8_t', false],
            ['payload', 'uint8_t', false],
            ['jpg_quality', 'uint8_t', false],
        ];
    }
}
exports.DataTransmissionHandshake = DataTransmissionHandshake;
