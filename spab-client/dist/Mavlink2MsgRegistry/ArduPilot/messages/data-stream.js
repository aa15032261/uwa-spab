"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStream = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Data stream status information.
*/
// stream_id The ID of the requested data stream uint8_t
// message_rate The message rate uint16_t
// on_off 1 stream is enabled, 0 stream is stopped. uint8_t
class DataStream extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 67;
        this._message_name = 'DATA_STREAM';
        this._crc_extra = 21;
        this._message_fields = [
            ['message_rate', 'uint16_t', false],
            ['stream_id', 'uint8_t', false],
            ['on_off', 'uint8_t', false],
        ];
    }
}
exports.DataStream = DataStream;
