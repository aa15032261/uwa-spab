"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestDataStream = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request a data stream.
*/
// target_system The target requested to send the message stream. uint8_t
// target_component The target requested to send the message stream. uint8_t
// req_stream_id The ID of the requested data stream uint8_t
// req_message_rate The requested message rate uint16_t
// start_stop 1 to start sending, 0 to stop sending. uint8_t
class RequestDataStream extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 66;
        this._message_name = 'REQUEST_DATA_STREAM';
        this._crc_extra = 148;
        this._message_fields = [
            ['req_message_rate', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['req_stream_id', 'uint8_t', false],
            ['start_stop', 'uint8_t', false],
        ];
    }
}
exports.RequestDataStream = RequestDataStream;
