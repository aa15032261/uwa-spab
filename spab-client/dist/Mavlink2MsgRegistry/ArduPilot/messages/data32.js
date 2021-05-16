"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data32 = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Data packet, size 32.
*/
// type Data type. uint8_t
// len Data length. uint8_t
// data Raw data. uint8_t
class Data32 extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 170;
        this._message_name = 'DATA32';
        this._crc_extra = 73;
        this._message_fields = [
            ['type', 'uint8_t', false],
            ['len', 'uint8_t', false],
            ['data', 'uint8_t', false],
        ];
    }
}
exports.Data32 = Data32;
