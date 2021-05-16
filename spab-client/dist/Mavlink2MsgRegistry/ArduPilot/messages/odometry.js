"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Odometry = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Odometry message to communicate odometry information with an external interface. Fits ROS REP 147 standard for aerial vehicles (http://www.ros.org/reps/rep-0147.html).
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// frame_id Coordinate frame of reference for the pose data. uint8_t
// child_frame_id Coordinate frame of reference for the velocity in free space (twist) data. uint8_t
// x X Position float
// y Y Position float
// z Z Position float
// q Quaternion components, w, x, y, z (1 0 0 0 is the null-rotation) float
// vx X linear speed float
// vy Y linear speed float
// vz Z linear speed float
// rollspeed Roll angular speed float
// pitchspeed Pitch angular speed float
// yawspeed Yaw angular speed float
// pose_covariance Row-major representation of a 6x6 pose cross-covariance matrix upper right triangle (states: x, y, z, roll, pitch, yaw; first six entries are the first ROW, next five entries are the second ROW, etc.). If unknown, assign NaN value to first element in the array. float
// velocity_covariance Row-major representation of a 6x6 velocity cross-covariance matrix upper right triangle (states: vx, vy, vz, rollspeed, pitchspeed, yawspeed; first six entries are the first ROW, next five entries are the second ROW, etc.). If unknown, assign NaN value to first element in the array. float
// reset_counter Estimate reset counter. This should be incremented when the estimate resets in any of the dimensions (position, velocity, attitude, angular speed). This is designed to be used when e.g an external SLAM system detects a loop-closure and the estimate jumps. uint8_t
// estimator_type Type of estimator that is providing the odometry. uint8_t
class Odometry extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 331;
        this._message_name = 'ODOMETRY';
        this._crc_extra = 91;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['x', 'float', false],
            ['y', 'float', false],
            ['z', 'float', false],
            ['q', 'float', false],
            ['vx', 'float', false],
            ['vy', 'float', false],
            ['vz', 'float', false],
            ['rollspeed', 'float', false],
            ['pitchspeed', 'float', false],
            ['yawspeed', 'float', false],
            ['pose_covariance', 'float', false],
            ['velocity_covariance', 'float', false],
            ['frame_id', 'uint8_t', false],
            ['child_frame_id', 'uint8_t', false],
            ['reset_counter', 'uint8_t', true],
            ['estimator_type', 'uint8_t', true],
        ];
    }
}
exports.Odometry = Odometry;
