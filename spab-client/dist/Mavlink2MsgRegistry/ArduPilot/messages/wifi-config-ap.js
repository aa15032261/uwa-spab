"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WifiConfigAp = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Configure AP SSID and Password.
*/
// ssid Name of Wi-Fi network (SSID). Leave it blank to leave it unchanged. char
// password Password. Leave it blank for an open AP. char
class WifiConfigAp extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 299;
        this._message_name = 'WIFI_CONFIG_AP';
        this._crc_extra = 19;
        this._message_fields = [
            ['ssid', 'char', false],
            ['password', 'char', false],
        ];
    }
}
exports.WifiConfigAp = WifiConfigAp;
