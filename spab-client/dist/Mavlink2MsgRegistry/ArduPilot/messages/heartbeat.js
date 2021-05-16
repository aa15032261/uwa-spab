"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heartbeat = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
The heartbeat message shows that a system or component is present and responding. The type and autopilot fields (along with the message component id), allow the receiving system to treat further messages from this system appropriately (e.g. by laying out the user interface based on the autopilot). This microservice is documented at https://mavlink.io/en/services/heartbeat.html
*/
// type Vehicle or component type. For a flight controller component the vehicle type (quadrotor, helicopter, etc.). For other components the component type (e.g. camera, gimbal, etc.). This should be used in preference to component id for identifying the component type. uint8_t
// autopilot Autopilot type / class. Use MAV_AUTOPILOT_INVALID for components that are not flight controllers. uint8_t
// base_mode System mode bitmap. uint8_t
// custom_mode A bitfield for use for autopilot-specific flags uint32_t
// system_status System status flag. uint8_t
// mavlink_version MAVLink version, not writable by user, gets added by protocol because of magic data type: uint8_t_mavlink_version uint8_t
class Heartbeat extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 0;
        this._message_name = 'HEARTBEAT';
        this._crc_extra = 50;
        this._message_fields = [
            ['custom_mode', 'uint32_t', false],
            ['type', 'uint8_t', false],
            ['autopilot', 'uint8_t', false],
            ['base_mode', 'uint8_t', false],
            ['system_status', 'uint8_t', false],
            ['mavlink_version', 'uint8_t', false],
        ];
    }
}
exports.Heartbeat = Heartbeat;
