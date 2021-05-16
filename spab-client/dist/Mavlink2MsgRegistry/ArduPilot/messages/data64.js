"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data64 = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Data packet, size 64.
*/
// type Data type. uint8_t
// len Data length. uint8_t
// data Raw data. uint8_t
class Data64 extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 171;
        this._message_name = 'DATA64';
        this._crc_extra = 181;
        this._message_fields = [
            ['type', 'uint8_t', false],
            ['len', 'uint8_t', false],
            ['data', 'uint8_t', false],
        ];
    }
}
exports.Data64 = Data64;
