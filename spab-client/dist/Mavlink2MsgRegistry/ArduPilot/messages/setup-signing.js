"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupSigning = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Setup a MAVLink2 signing key. If called with secret_key of all zero and zero initial_timestamp will disable signing
*/
// target_system system id of the target uint8_t
// target_component component ID of the target uint8_t
// secret_key signing key uint8_t
// initial_timestamp initial timestamp uint64_t
class SetupSigning extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 256;
        this._message_name = 'SETUP_SIGNING';
        this._crc_extra = 71;
        this._message_fields = [
            ['initial_timestamp', 'uint64_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['secret_key', 'uint8_t', false],
        ];
    }
}
exports.SetupSigning = SetupSigning;
