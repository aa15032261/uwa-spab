"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightInformation = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Information about flight since last arming.
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// arming_time_utc Timestamp at arming (time since UNIX epoch) in UTC, 0 for unknown uint64_t
// takeoff_time_utc Timestamp at takeoff (time since UNIX epoch) in UTC, 0 for unknown uint64_t
// flight_uuid Universally unique identifier (UUID) of flight, should correspond to name of log files uint64_t
class FlightInformation extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 264;
        this._message_name = 'FLIGHT_INFORMATION';
        this._crc_extra = 49;
        this._message_fields = [
            ['arming_time_utc', 'uint64_t', false],
            ['takeoff_time_utc', 'uint64_t', false],
            ['flight_uuid', 'uint64_t', false],
            ['time_boot_ms', 'uint32_t', false],
        ];
    }
}
exports.FlightInformation = FlightInformation;
