"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTransferProtocol = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
File transfer message
*/
// target_network Network ID (0 for broadcast) uint8_t
// target_system System ID (0 for broadcast) uint8_t
// target_component Component ID (0 for broadcast) uint8_t
// payload Variable length payload. The length is defined by the remaining message length when subtracting the header and other fields.  The entire content of this block is opaque unless you understand any the encoding message_type.  The particular encoding used can be extension specific and might not always be documented as part of the mavlink specification. uint8_t
class FileTransferProtocol extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 110;
        this._message_name = 'FILE_TRANSFER_PROTOCOL';
        this._crc_extra = 84;
        this._message_fields = [
            ['target_network', 'uint8_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['payload', 'uint8_t', false],
        ];
    }
}
exports.FileTransferProtocol = FileTransferProtocol;
