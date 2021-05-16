"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsbdLinkStatus = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Status of the Iridium SBD link.
*/
// timestamp Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// last_heartbeat Timestamp of the last successful sbd session. The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// failed_sessions Number of failed SBD sessions. uint16_t
// successful_sessions Number of successful SBD sessions. uint16_t
// signal_quality Signal quality equal to the number of bars displayed on the ISU signal strength indicator. Range is 0 to 5, where 0 indicates no signal and 5 indicates maximum signal strength. uint8_t
// ring_pending 1: Ring call pending, 0: No call pending. uint8_t
// tx_session_pending 1: Transmission session pending, 0: No transmission session pending. uint8_t
// rx_session_pending 1: Receiving session pending, 0: No receiving session pending. uint8_t
class IsbdLinkStatus extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 335;
        this._message_name = 'ISBD_LINK_STATUS';
        this._crc_extra = 225;
        this._message_fields = [
            ['timestamp', 'uint64_t', false],
            ['last_heartbeat', 'uint64_t', false],
            ['failed_sessions', 'uint16_t', false],
            ['successful_sessions', 'uint16_t', false],
            ['signal_quality', 'uint8_t', false],
            ['ring_pending', 'uint8_t', false],
            ['tx_session_pending', 'uint8_t', false],
            ['rx_session_pending', 'uint8_t', false],
        ];
    }
}
exports.IsbdLinkStatus = IsbdLinkStatus;
