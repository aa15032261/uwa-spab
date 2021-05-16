"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPositionNed = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The filtered local position (e.g. fused computer vision and accelerometers). Coordinate frame is right-handed, Z-axis down (aeronautical frame, NED / north-east-down convention)
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// x X Position float
// y Y Position float
// z Z Position float
// vx X Speed float
// vy Y Speed float
// vz Z Speed float
class LocalPositionNed extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 32;
        this._message_name = 'LOCAL_POSITION_NED';
        this._crc_extra = 185;
        this._message_fields = [
            ['time_boot_ms', 'uint32_t', false],
            ['x', 'float', false],
            ['y', 'float', false],
            ['z', 'float', false],
            ['vx', 'float', false],
            ['vy', 'float', false],
            ['vz', 'float', false],
        ];
    }
}
exports.LocalPositionNed = LocalPositionNed;
