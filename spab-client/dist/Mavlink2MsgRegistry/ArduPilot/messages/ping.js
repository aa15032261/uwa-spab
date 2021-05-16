"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ping = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
A ping message either requesting or responding to a ping. This allows to measure the system latencies, including serial port, radio modem and UDP connections. The ping microservice is documented at https://mavlink.io/en/services/ping.html
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// seq PING sequence uint32_t
// target_system 0: request ping from all receiving systems. If greater than 0: message is a ping response and number is the system id of the requesting system uint8_t
// target_component 0: request ping from all receiving components. If greater than 0: message is a ping response and number is the component id of the requesting component. uint8_t
class Ping extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 4;
        this._message_name = 'PING';
        this._crc_extra = 237;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['seq', 'uint32_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.Ping = Ping;
