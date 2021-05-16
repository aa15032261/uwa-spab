"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statustext = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Status text message. These messages are printed in yellow in the COMM console of QGroundControl. WARNING: They consume quite some bandwidth, so use only for important status and error messages. If implemented wisely, these messages are buffered on the MCU and sent only at a limited rate (e.g. 10 Hz).
*/
// severity Severity of status. Relies on the definitions within RFC-5424. uint8_t
// text Status text message, without null termination character char
// id Unique (opaque) identifier for this statustext message.  May be used to reassemble a logical long-statustext message from a sequence of chunks.  A value of zero indicates this is the only chunk in the sequence and the message can be emitted immediately. uint16_t
// chunk_seq This chunk's sequence number; indexing is from zero.  Any null character in the text field is taken to mean this was the last chunk. uint8_t
class Statustext extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 253;
        this._message_name = 'STATUSTEXT';
        this._crc_extra = 83;
        this._message_fields = [
            ['severity', 'uint8_t', false],
            ['text', 'char', false],
            ['id', 'uint16_t', true],
            ['chunk_seq', 'uint8_t', true],
        ];
    }
}
exports.Statustext = Statustext;
