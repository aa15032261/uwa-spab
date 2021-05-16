"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeOperatorControlAck = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Accept / deny control of this MAV
*/
// gcs_system_id ID of the GCS this message uint8_t
// control_request 0: request control of this MAV, 1: Release control of this MAV uint8_t
// ack 0: ACK, 1: NACK: Wrong passkey, 2: NACK: Unsupported passkey encryption method, 3: NACK: Already under control uint8_t
class ChangeOperatorControlAck extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 6;
        this._message_name = 'CHANGE_OPERATOR_CONTROL_ACK';
        this._crc_extra = 104;
        this._message_fields = [
            ['gcs_system_id', 'uint8_t', false],
            ['control_request', 'uint8_t', false],
            ['ack', 'uint8_t', false],
        ];
    }
}
exports.ChangeOperatorControlAck = ChangeOperatorControlAck;
