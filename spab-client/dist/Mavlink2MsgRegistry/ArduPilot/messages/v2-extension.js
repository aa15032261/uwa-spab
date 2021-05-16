"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V2Extension = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Message implementing parts of the V2 payload specs in V1 frames for transitional support.
*/
// target_network Network ID (0 for broadcast) uint8_t
// target_system System ID (0 for broadcast) uint8_t
// target_component Component ID (0 for broadcast) uint8_t
// message_type A code that identifies the software component that understands this message (analogous to USB device classes or mime type strings). If this code is less than 32768, it is considered a 'registered' protocol extension and the corresponding entry should be added to https://github.com/mavlink/mavlink/definition_files/extension_message_ids.xml. Software creators can register blocks of message IDs as needed (useful for GCS specific metadata, etc...). Message_types greater than 32767 are considered local experiments and should not be checked in to any widely distributed codebase. uint16_t
// payload Variable length payload. The length must be encoded in the payload as part of the message_type protocol, e.g. by including the length as payload data, or by terminating the payload data with a non-zero marker. This is required in order to reconstruct zero-terminated payloads that are (or otherwise would be) trimmed by MAVLink 2 empty-byte truncation. The entire content of the payload block is opaque unless you understand the encoding message_type. The particular encoding used can be extension specific and might not always be documented as part of the MAVLink specification. uint8_t
class V2Extension extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 248;
        this._message_name = 'V2_EXTENSION';
        this._crc_extra = 8;
        this._message_fields = [
            ['message_type', 'uint16_t', false],
            ['target_network', 'uint8_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['payload', 'uint8_t', false],
        ];
    }
}
exports.V2Extension = V2Extension;
