"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simstate = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Status of simulation environment, if used.
*/
// roll Roll angle. float
// pitch Pitch angle. float
// yaw Yaw angle. float
// xacc X acceleration. float
// yacc Y acceleration. float
// zacc Z acceleration. float
// xgyro Angular speed around X axis. float
// ygyro Angular speed around Y axis. float
// zgyro Angular speed around Z axis. float
// lat Latitude. int32_t
// lng Longitude. int32_t
class Simstate extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 164;
        this._message_name = 'SIMSTATE';
        this._crc_extra = 154;
        this._message_fields = [
            ['roll', 'float', false],
            ['pitch', 'float', false],
            ['yaw', 'float', false],
            ['xacc', 'float', false],
            ['yacc', 'float', false],
            ['zacc', 'float', false],
            ['xgyro', 'float', false],
            ['ygyro', 'float', false],
            ['zgyro', 'float', false],
            ['lat', 'int32_t', false],
            ['lng', 'int32_t', false],
        ];
    }
}
exports.Simstate = Simstate;
