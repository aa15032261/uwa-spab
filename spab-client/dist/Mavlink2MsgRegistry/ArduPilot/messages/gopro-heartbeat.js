"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoproHeartbeat = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Heartbeat from a HeroBus attached GoPro.
*/
// status Status. uint8_t
// capture_mode Current capture mode. uint8_t
// flags Additional status bits. uint8_t
class GoproHeartbeat extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 215;
        this._message_name = 'GOPRO_HEARTBEAT';
        this._crc_extra = 101;
        this._message_fields = [
            ['status', 'uint8_t', false],
            ['capture_mode', 'uint8_t', false],
            ['flags', 'uint8_t', false],
        ];
    }
}
exports.GoproHeartbeat = GoproHeartbeat;
