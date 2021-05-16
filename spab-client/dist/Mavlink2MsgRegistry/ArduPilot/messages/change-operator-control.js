"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeOperatorControl = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request to control this MAV
*/
// target_system System the GCS requests control for uint8_t
// control_request 0: request control of this MAV, 1: Release control of this MAV uint8_t
// version 0: key as plaintext, 1-255: future, different hashing/encryption variants. The GCS should in general use the safest mode possible initially and then gradually move down the encryption level if it gets a NACK message indicating an encryption mismatch. uint8_t
// passkey Password / Key, depending on version plaintext or encrypted. 25 or less characters, NULL terminated. The characters may involve A-Z, a-z, 0-9, and "!?,.-" char
class ChangeOperatorControl extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 5;
        this._message_name = 'CHANGE_OPERATOR_CONTROL';
        this._crc_extra = 217;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['control_request', 'uint8_t', false],
            ['version', 'uint8_t', false],
            ['passkey', 'char', false],
        ];
    }
}
exports.ChangeOperatorControl = ChangeOperatorControl;
