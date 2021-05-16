"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandLong = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Send a command with up to seven parameters to the MAV. The command microservice is documented at https://mavlink.io/en/services/command.html
*/
// target_system System which should execute the command uint8_t
// target_component Component which should execute the command, 0 for all components uint8_t
// command Command ID (of command to send). uint16_t
// confirmation 0: First transmission of this command. 1-255: Confirmation transmissions (e.g. for kill command) uint8_t
// param1 Parameter 1 (for the specific command). float
// param2 Parameter 2 (for the specific command). float
// param3 Parameter 3 (for the specific command). float
// param4 Parameter 4 (for the specific command). float
// param5 Parameter 5 (for the specific command). float
// param6 Parameter 6 (for the specific command). float
// param7 Parameter 7 (for the specific command). float
class CommandLong extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 76;
        this._message_name = 'COMMAND_LONG';
        this._crc_extra = 152;
        this._message_fields = [
            ['param1', 'float', false],
            ['param2', 'float', false],
            ['param3', 'float', false],
            ['param4', 'float', false],
            ['param5', 'float', false],
            ['param6', 'float', false],
            ['param7', 'float', false],
            ['command', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['confirmation', 'uint8_t', false],
        ];
    }
}
exports.CommandLong = CommandLong;
