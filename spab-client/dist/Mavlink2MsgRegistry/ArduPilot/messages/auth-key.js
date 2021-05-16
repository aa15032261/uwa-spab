"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthKey = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Emit an encrypted signature / key identifying this system. PLEASE NOTE: This protocol has been kept simple, so transmitting the key requires an encrypted channel for true safety.
*/
// key key char
class AuthKey extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 7;
        this._message_name = 'AUTH_KEY';
        this._crc_extra = 119;
        this._message_fields = [
            ['key', 'char', false],
        ];
    }
}
exports.AuthKey = AuthKey;
