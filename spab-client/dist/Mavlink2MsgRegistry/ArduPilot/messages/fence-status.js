"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FenceStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Status of geo-fencing. Sent in extended status stream when fencing enabled.
*/
// breach_status Breach status (0 if currently inside fence, 1 if outside). uint8_t
// breach_count Number of fence breaches. uint16_t
// breach_type Last breach type. uint8_t
// breach_time Time (since boot) of last breach. uint32_t
// breach_mitigation Active action to prevent fence breach uint8_t
class FenceStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 162;
        this._message_name = 'FENCE_STATUS';
        this._crc_extra = 189;
        this._message_fields = [
            ['breach_time', 'uint32_t', false],
            ['breach_count', 'uint16_t', false],
            ['breach_status', 'uint8_t', false],
            ['breach_type', 'uint8_t', false],
            ['breach_mitigation', 'uint8_t', true],
        ];
    }
}
exports.FenceStatus = FenceStatus;
