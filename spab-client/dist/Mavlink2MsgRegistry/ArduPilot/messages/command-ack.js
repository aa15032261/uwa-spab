"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandAck = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Report status of a command. Includes feedback whether the command was executed. The command microservice is documented at https://mavlink.io/en/services/command.html
*/
// command Command ID (of acknowledged command). uint16_t
// result Result of command. uint8_t
class CommandAck extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 77;
        this._message_name = 'COMMAND_ACK';
        this._crc_extra = 143;
        this._message_fields = [
            ['command', 'uint16_t', false],
            ['result', 'uint8_t', false],
        ];
    }
}
exports.CommandAck = CommandAck;
