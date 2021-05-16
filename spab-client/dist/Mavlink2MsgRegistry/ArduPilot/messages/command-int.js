"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandInt = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Message encoding a command with parameters as scaled integers. Scaling depends on the actual command value. The command microservice is documented at https://mavlink.io/en/services/command.html
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// frame The coordinate system of the COMMAND. uint8_t
// command The scheduled action for the mission item. uint16_t
// current false:0, true:1 uint8_t
// autocontinue autocontinue to next wp uint8_t
// param1 PARAM1, see MAV_CMD enum float
// param2 PARAM2, see MAV_CMD enum float
// param3 PARAM3, see MAV_CMD enum float
// param4 PARAM4, see MAV_CMD enum float
// x PARAM5 / local: x position in meters * 1e4, global: latitude in degrees * 10^7 int32_t
// y PARAM6 / local: y position in meters * 1e4, global: longitude in degrees * 10^7 int32_t
// z PARAM7 / z position: global: altitude in meters (relative or absolute, depending on frame). float
class CommandInt extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 75;
        this._message_name = 'COMMAND_INT';
        this._crc_extra = 158;
        this._message_fields = [
            ['param1', 'float', false],
            ['param2', 'float', false],
            ['param3', 'float', false],
            ['param4', 'float', false],
            ['x', 'int32_t', false],
            ['y', 'int32_t', false],
            ['z', 'float', false],
            ['command', 'uint16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['frame', 'uint8_t', false],
            ['current', 'uint8_t', false],
            ['autocontinue', 'uint8_t', false],
        ];
    }
}
exports.CommandInt = CommandInt;
