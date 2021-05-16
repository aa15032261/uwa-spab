"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimState = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Status of simulation environment, if used
*/
// q1 True attitude quaternion component 1, w (1 in null-rotation) float
// q2 True attitude quaternion component 2, x (0 in null-rotation) float
// q3 True attitude quaternion component 3, y (0 in null-rotation) float
// q4 True attitude quaternion component 4, z (0 in null-rotation) float
// roll Attitude roll expressed as Euler angles, not recommended except for human-readable outputs float
// pitch Attitude pitch expressed as Euler angles, not recommended except for human-readable outputs float
// yaw Attitude yaw expressed as Euler angles, not recommended except for human-readable outputs float
// xacc X acceleration float
// yacc Y acceleration float
// zacc Z acceleration float
// xgyro Angular speed around X axis float
// ygyro Angular speed around Y axis float
// zgyro Angular speed around Z axis float
// lat Latitude float
// lon Longitude float
// alt Altitude float
// std_dev_horz Horizontal position standard deviation float
// std_dev_vert Vertical position standard deviation float
// vn True velocity in north direction in earth-fixed NED frame float
// ve True velocity in east direction in earth-fixed NED frame float
// vd True velocity in down direction in earth-fixed NED frame float
class SimState extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 108;
        this._message_name = 'SIM_STATE';
        this._crc_extra = 32;
        this._message_fields = [
            ['q1', 'float', false],
            ['q2', 'float', false],
            ['q3', 'float', false],
            ['q4', 'float', false],
            ['roll', 'float', false],
            ['pitch', 'float', false],
            ['yaw', 'float', false],
            ['xacc', 'float', false],
            ['yacc', 'float', false],
            ['zacc', 'float', false],
            ['xgyro', 'float', false],
            ['ygyro', 'float', false],
            ['zgyro', 'float', false],
            ['lat', 'float', false],
            ['lon', 'float', false],
            ['alt', 'float', false],
            ['std_dev_horz', 'float', false],
            ['std_dev_vert', 'float', false],
            ['vn', 'float', false],
            ['ve', 'float', false],
            ['vd', 'float', false],
        ];
    }
}
exports.SimState = SimState;
