"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collision = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Information about a potential collision
*/
// src Collision data source uint8_t
// id Unique identifier, domain based on src field uint32_t
// action Action that is being taken to avoid this collision uint8_t
// threat_level How concerned the aircraft is about this collision uint8_t
// time_to_minimum_delta Estimated time until collision occurs float
// altitude_minimum_delta Closest vertical distance between vehicle and object float
// horizontal_minimum_delta Closest horizontal distance between vehicle and object float
class Collision extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 247;
        this._message_name = 'COLLISION';
        this._crc_extra = 81;
        this._message_fields = [
            ['id', 'uint32_t', false],
            ['time_to_minimum_delta', 'float', false],
            ['altitude_minimum_delta', 'float', false],
            ['horizontal_minimum_delta', 'float', false],
            ['src', 'uint8_t', false],
            ['action', 'uint8_t', false],
            ['threat_level', 'uint8_t', false],
        ];
    }
}
exports.Collision = Collision;
