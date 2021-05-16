"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelDistance = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Cumulative distance traveled for each reported wheel.
*/
// time_usec Timestamp (synced to UNIX time or since system boot). uint64_t
// count Number of wheels reported. uint8_t
// distance Distance reported by individual wheel encoders. Forward rotations increase values, reverse rotations decrease them. Not all wheels will necessarily have wheel encoders; the mapping of encoders to wheel positions must be agreed/understood by the endpoints. double
class WheelDistance extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 9000;
        this._message_name = 'WHEEL_DISTANCE';
        this._crc_extra = 113;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['distance', 'double', false],
            ['count', 'uint8_t', false],
        ];
    }
}
exports.WheelDistance = WheelDistance;
