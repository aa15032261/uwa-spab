"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IcarousHeartbeat = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
ICAROUS heartbeat
*/
// status See the FMS_STATE enum. uint8_t
class IcarousHeartbeat extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 42000;
        this._message_name = 'ICAROUS_HEARTBEAT';
        this._crc_extra = 227;
        this._message_fields = [
            ['status', 'uint8_t', false],
        ];
    }
}
exports.IcarousHeartbeat = IcarousHeartbeat;
