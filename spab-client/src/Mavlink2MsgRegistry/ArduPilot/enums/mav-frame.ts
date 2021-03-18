export enum MavFrame {
	MAV_FRAME_GLOBAL = 0, // Global (WGS84) coordinate frame + MSL altitude. First value / x: latitude, second value / y: longitude, third value / z: positive altitude over mean sea level (MSL).
	MAV_FRAME_LOCAL_NED = 1, // Local coordinate frame, Z-down (x: north, y: east, z: down).
	MAV_FRAME_MISSION = 2, // NOT a coordinate frame, indicates a mission command.
	MAV_FRAME_GLOBAL_RELATIVE_ALT = 3, // Global (WGS84) coordinate frame + altitude relative to the home position. First value / x: latitude, second value / y: longitude, third value / z: positive altitude with 0 being at the altitude of the home location.
	MAV_FRAME_LOCAL_ENU = 4, // Local coordinate frame, Z-up (x: east, y: north, z: up).
	MAV_FRAME_GLOBAL_INT = 5, // Global (WGS84) coordinate frame (scaled) + MSL altitude. First value / x: latitude in degrees*1.0e-7, second value / y: longitude in degrees*1.0e-7, third value / z: positive altitude over mean sea level (MSL).
	MAV_FRAME_GLOBAL_RELATIVE_ALT_INT = 6, // Global (WGS84) coordinate frame (scaled) + altitude relative to the home position. First value / x: latitude in degrees*10e-7, second value / y: longitude in degrees*10e-7, third value / z: positive altitude with 0 being at the altitude of the home location.
	MAV_FRAME_LOCAL_OFFSET_NED = 7, // Offset to the current local frame. Anything expressed in this frame should be added to the current local frame position.
	MAV_FRAME_BODY_NED = 8, // Setpoint in body NED frame. This makes sense if all position control is externalized - e.g. useful to command 2 m/s^2 acceleration to the right.
	MAV_FRAME_BODY_OFFSET_NED = 9, // Offset in body NED frame. This makes sense if adding setpoints to the current flight path, to avoid an obstacle - e.g. useful to command 2 m/s^2 acceleration to the east.
	MAV_FRAME_GLOBAL_TERRAIN_ALT = 10, // Global (WGS84) coordinate frame with AGL altitude (at the waypoint coordinate). First value / x: latitude in degrees, second value / y: longitude in degrees, third value / z: positive altitude in meters with 0 being at ground level in terrain model.
	MAV_FRAME_GLOBAL_TERRAIN_ALT_INT = 11, // Global (WGS84) coordinate frame (scaled) with AGL altitude (at the waypoint coordinate). First value / x: latitude in degrees*10e-7, second value / y: longitude in degrees*10e-7, third value / z: positive altitude in meters with 0 being at ground level in terrain model.
	MAV_FRAME_BODY_FRD = 12, // Body fixed frame of reference, Z-down (x: forward, y: right, z: down).
	MAV_FRAME_BODY_FLU = 13, // Body fixed frame of reference, Z-up (x: forward, y: left, z: up).
	MAV_FRAME_MOCAP_NED = 14, // Odometry local coordinate frame of data given by a motion capture system, Z-down (x: north, y: east, z: down).
	MAV_FRAME_MOCAP_ENU = 15, // Odometry local coordinate frame of data given by a motion capture system, Z-up (x: east, y: north, z: up).
	MAV_FRAME_VISION_NED = 16, // Odometry local coordinate frame of data given by a vision estimation system, Z-down (x: north, y: east, z: down).
	MAV_FRAME_VISION_ENU = 17, // Odometry local coordinate frame of data given by a vision estimation system, Z-up (x: east, y: north, z: up).
	MAV_FRAME_ESTIM_NED = 18, // Odometry local coordinate frame of data given by an estimator running onboard the vehicle, Z-down (x: north, y: east, z: down).
	MAV_FRAME_ESTIM_ENU = 19, // Odometry local coordinate frame of data given by an estimator running onboard the vehicle, Z-up (x: east, y: noth, z: up).
	MAV_FRAME_LOCAL_FRD = 20, // Forward, Right, Down coordinate frame. This is a local frame with Z-down and arbitrary F/R alignment (i.e. not aligned with NED/earth frame).
	MAV_FRAME_LOCAL_FLU = 21, // Forward, Left, Up coordinate frame. This is a local frame with Z-up and arbitrary F/L alignment (i.e. not aligned with ENU/earth frame).
	MAV_FRAME_ENUM_END = 22, // 
}