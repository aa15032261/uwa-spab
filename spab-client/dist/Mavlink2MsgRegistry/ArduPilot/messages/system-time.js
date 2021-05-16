"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemTime = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The system time is the time of the master clock, typically the computer clock of the main onboard computer.
*/
// time_unix_usec Timestamp (UNIX epoch time). uint64_t
// time_boot_ms Timestamp (time since system boot). uint32_t
class SystemTime extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 2;
        this._message_name = 'SYSTEM_TIME';
        this._crc_extra = 137;
        this._message_fields = [
            ['time_unix_usec', 'uint64_t', false],
            ['time_boot_ms', 'uint32_t', false],
        ];
    }
}
exports.SystemTime = SystemTime;
