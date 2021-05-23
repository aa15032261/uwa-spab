"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MavCmd = void 0;
var MavCmd;
(function (MavCmd) {
    MavCmd[MavCmd["MAV_CMD_NAV_WAYPOINT"] = 16] = "MAV_CMD_NAV_WAYPOINT";
    MavCmd[MavCmd["MAV_CMD_NAV_LOITER_UNLIM"] = 17] = "MAV_CMD_NAV_LOITER_UNLIM";
    MavCmd[MavCmd["MAV_CMD_NAV_LOITER_TURNS"] = 18] = "MAV_CMD_NAV_LOITER_TURNS";
    MavCmd[MavCmd["MAV_CMD_NAV_LOITER_TIME"] = 19] = "MAV_CMD_NAV_LOITER_TIME";
    MavCmd[MavCmd["MAV_CMD_NAV_RETURN_TO_LAUNCH"] = 20] = "MAV_CMD_NAV_RETURN_TO_LAUNCH";
    MavCmd[MavCmd["MAV_CMD_NAV_LAND"] = 21] = "MAV_CMD_NAV_LAND";
    MavCmd[MavCmd["MAV_CMD_NAV_TAKEOFF"] = 22] = "MAV_CMD_NAV_TAKEOFF";
    MavCmd[MavCmd["MAV_CMD_NAV_LAND_LOCAL"] = 23] = "MAV_CMD_NAV_LAND_LOCAL";
    MavCmd[MavCmd["MAV_CMD_NAV_TAKEOFF_LOCAL"] = 24] = "MAV_CMD_NAV_TAKEOFF_LOCAL";
    MavCmd[MavCmd["MAV_CMD_NAV_FOLLOW"] = 25] = "MAV_CMD_NAV_FOLLOW";
    MavCmd[MavCmd["MAV_CMD_NAV_CONTINUE_AND_CHANGE_ALT"] = 30] = "MAV_CMD_NAV_CONTINUE_AND_CHANGE_ALT";
    MavCmd[MavCmd["MAV_CMD_NAV_LOITER_TO_ALT"] = 31] = "MAV_CMD_NAV_LOITER_TO_ALT";
    MavCmd[MavCmd["MAV_CMD_DO_FOLLOW"] = 32] = "MAV_CMD_DO_FOLLOW";
    MavCmd[MavCmd["MAV_CMD_DO_FOLLOW_REPOSITION"] = 33] = "MAV_CMD_DO_FOLLOW_REPOSITION";
    MavCmd[MavCmd["MAV_CMD_NAV_ROI"] = 80] = "MAV_CMD_NAV_ROI";
    MavCmd[MavCmd["MAV_CMD_NAV_PATHPLANNING"] = 81] = "MAV_CMD_NAV_PATHPLANNING";
    MavCmd[MavCmd["MAV_CMD_NAV_SPLINE_WAYPOINT"] = 82] = "MAV_CMD_NAV_SPLINE_WAYPOINT";
    MavCmd[MavCmd["MAV_CMD_NAV_ALTITUDE_WAIT"] = 83] = "MAV_CMD_NAV_ALTITUDE_WAIT";
    MavCmd[MavCmd["MAV_CMD_NAV_VTOL_TAKEOFF"] = 84] = "MAV_CMD_NAV_VTOL_TAKEOFF";
    MavCmd[MavCmd["MAV_CMD_NAV_VTOL_LAND"] = 85] = "MAV_CMD_NAV_VTOL_LAND";
    MavCmd[MavCmd["MAV_CMD_NAV_GUIDED_ENABLE"] = 92] = "MAV_CMD_NAV_GUIDED_ENABLE";
    MavCmd[MavCmd["MAV_CMD_NAV_DELAY"] = 93] = "MAV_CMD_NAV_DELAY";
    MavCmd[MavCmd["MAV_CMD_NAV_PAYLOAD_PLACE"] = 94] = "MAV_CMD_NAV_PAYLOAD_PLACE";
    MavCmd[MavCmd["MAV_CMD_NAV_LAST"] = 95] = "MAV_CMD_NAV_LAST";
    MavCmd[MavCmd["MAV_CMD_CONDITION_DELAY"] = 112] = "MAV_CMD_CONDITION_DELAY";
    MavCmd[MavCmd["MAV_CMD_CONDITION_CHANGE_ALT"] = 113] = "MAV_CMD_CONDITION_CHANGE_ALT";
    MavCmd[MavCmd["MAV_CMD_CONDITION_DISTANCE"] = 114] = "MAV_CMD_CONDITION_DISTANCE";
    MavCmd[MavCmd["MAV_CMD_CONDITION_YAW"] = 115] = "MAV_CMD_CONDITION_YAW";
    MavCmd[MavCmd["MAV_CMD_CONDITION_LAST"] = 159] = "MAV_CMD_CONDITION_LAST";
    MavCmd[MavCmd["MAV_CMD_DO_SET_MODE"] = 176] = "MAV_CMD_DO_SET_MODE";
    MavCmd[MavCmd["MAV_CMD_DO_JUMP"] = 177] = "MAV_CMD_DO_JUMP";
    MavCmd[MavCmd["MAV_CMD_DO_CHANGE_SPEED"] = 178] = "MAV_CMD_DO_CHANGE_SPEED";
    MavCmd[MavCmd["MAV_CMD_DO_SET_HOME"] = 179] = "MAV_CMD_DO_SET_HOME";
    MavCmd[MavCmd["MAV_CMD_DO_SET_PARAMETER"] = 180] = "MAV_CMD_DO_SET_PARAMETER";
    MavCmd[MavCmd["MAV_CMD_DO_SET_RELAY"] = 181] = "MAV_CMD_DO_SET_RELAY";
    MavCmd[MavCmd["MAV_CMD_DO_REPEAT_RELAY"] = 182] = "MAV_CMD_DO_REPEAT_RELAY";
    MavCmd[MavCmd["MAV_CMD_DO_SET_SERVO"] = 183] = "MAV_CMD_DO_SET_SERVO";
    MavCmd[MavCmd["MAV_CMD_DO_REPEAT_SERVO"] = 184] = "MAV_CMD_DO_REPEAT_SERVO";
    MavCmd[MavCmd["MAV_CMD_DO_FLIGHTTERMINATION"] = 185] = "MAV_CMD_DO_FLIGHTTERMINATION";
    MavCmd[MavCmd["MAV_CMD_DO_CHANGE_ALTITUDE"] = 186] = "MAV_CMD_DO_CHANGE_ALTITUDE";
    MavCmd[MavCmd["MAV_CMD_DO_LAND_START"] = 189] = "MAV_CMD_DO_LAND_START";
    MavCmd[MavCmd["MAV_CMD_DO_RALLY_LAND"] = 190] = "MAV_CMD_DO_RALLY_LAND";
    MavCmd[MavCmd["MAV_CMD_DO_GO_AROUND"] = 191] = "MAV_CMD_DO_GO_AROUND";
    MavCmd[MavCmd["MAV_CMD_DO_REPOSITION"] = 192] = "MAV_CMD_DO_REPOSITION";
    MavCmd[MavCmd["MAV_CMD_DO_PAUSE_CONTINUE"] = 193] = "MAV_CMD_DO_PAUSE_CONTINUE";
    MavCmd[MavCmd["MAV_CMD_DO_SET_REVERSE"] = 194] = "MAV_CMD_DO_SET_REVERSE";
    MavCmd[MavCmd["MAV_CMD_DO_SET_ROI_LOCATION"] = 195] = "MAV_CMD_DO_SET_ROI_LOCATION";
    MavCmd[MavCmd["MAV_CMD_DO_SET_ROI_WPNEXT_OFFSET"] = 196] = "MAV_CMD_DO_SET_ROI_WPNEXT_OFFSET";
    MavCmd[MavCmd["MAV_CMD_DO_SET_ROI_NONE"] = 197] = "MAV_CMD_DO_SET_ROI_NONE";
    MavCmd[MavCmd["MAV_CMD_DO_SET_ROI_SYSID"] = 198] = "MAV_CMD_DO_SET_ROI_SYSID";
    MavCmd[MavCmd["MAV_CMD_DO_CONTROL_VIDEO"] = 200] = "MAV_CMD_DO_CONTROL_VIDEO";
    MavCmd[MavCmd["MAV_CMD_DO_SET_ROI"] = 201] = "MAV_CMD_DO_SET_ROI";
    MavCmd[MavCmd["MAV_CMD_DO_DIGICAM_CONFIGURE"] = 202] = "MAV_CMD_DO_DIGICAM_CONFIGURE";
    MavCmd[MavCmd["MAV_CMD_DO_DIGICAM_CONTROL"] = 203] = "MAV_CMD_DO_DIGICAM_CONTROL";
    MavCmd[MavCmd["MAV_CMD_DO_MOUNT_CONFIGURE"] = 204] = "MAV_CMD_DO_MOUNT_CONFIGURE";
    MavCmd[MavCmd["MAV_CMD_DO_MOUNT_CONTROL"] = 205] = "MAV_CMD_DO_MOUNT_CONTROL";
    MavCmd[MavCmd["MAV_CMD_DO_SET_CAM_TRIGG_DIST"] = 206] = "MAV_CMD_DO_SET_CAM_TRIGG_DIST";
    MavCmd[MavCmd["MAV_CMD_DO_FENCE_ENABLE"] = 207] = "MAV_CMD_DO_FENCE_ENABLE";
    MavCmd[MavCmd["MAV_CMD_DO_PARACHUTE"] = 208] = "MAV_CMD_DO_PARACHUTE";
    MavCmd[MavCmd["MAV_CMD_DO_MOTOR_TEST"] = 209] = "MAV_CMD_DO_MOTOR_TEST";
    MavCmd[MavCmd["MAV_CMD_DO_INVERTED_FLIGHT"] = 210] = "MAV_CMD_DO_INVERTED_FLIGHT";
    MavCmd[MavCmd["MAV_CMD_DO_GRIPPER"] = 211] = "MAV_CMD_DO_GRIPPER";
    MavCmd[MavCmd["MAV_CMD_DO_AUTOTUNE_ENABLE"] = 212] = "MAV_CMD_DO_AUTOTUNE_ENABLE";
    MavCmd[MavCmd["MAV_CMD_NAV_SET_YAW_SPEED"] = 213] = "MAV_CMD_NAV_SET_YAW_SPEED";
    MavCmd[MavCmd["MAV_CMD_DO_SET_CAM_TRIGG_INTERVAL"] = 214] = "MAV_CMD_DO_SET_CAM_TRIGG_INTERVAL";
    MavCmd[MavCmd["MAV_CMD_DO_SET_RESUME_REPEAT_DIST"] = 215] = "MAV_CMD_DO_SET_RESUME_REPEAT_DIST";
    MavCmd[MavCmd["MAV_CMD_DO_MOUNT_CONTROL_QUAT"] = 220] = "MAV_CMD_DO_MOUNT_CONTROL_QUAT";
    MavCmd[MavCmd["MAV_CMD_DO_GUIDED_MASTER"] = 221] = "MAV_CMD_DO_GUIDED_MASTER";
    MavCmd[MavCmd["MAV_CMD_DO_GUIDED_LIMITS"] = 222] = "MAV_CMD_DO_GUIDED_LIMITS";
    MavCmd[MavCmd["MAV_CMD_DO_ENGINE_CONTROL"] = 223] = "MAV_CMD_DO_ENGINE_CONTROL";
    MavCmd[MavCmd["MAV_CMD_DO_SET_MISSION_CURRENT"] = 224] = "MAV_CMD_DO_SET_MISSION_CURRENT";
    MavCmd[MavCmd["MAV_CMD_DO_LAST"] = 240] = "MAV_CMD_DO_LAST";
    MavCmd[MavCmd["MAV_CMD_PREFLIGHT_CALIBRATION"] = 241] = "MAV_CMD_PREFLIGHT_CALIBRATION";
    MavCmd[MavCmd["MAV_CMD_PREFLIGHT_SET_SENSOR_OFFSETS"] = 242] = "MAV_CMD_PREFLIGHT_SET_SENSOR_OFFSETS";
    MavCmd[MavCmd["MAV_CMD_PREFLIGHT_UAVCAN"] = 243] = "MAV_CMD_PREFLIGHT_UAVCAN";
    MavCmd[MavCmd["MAV_CMD_PREFLIGHT_STORAGE"] = 245] = "MAV_CMD_PREFLIGHT_STORAGE";
    MavCmd[MavCmd["MAV_CMD_PREFLIGHT_REBOOT_SHUTDOWN"] = 246] = "MAV_CMD_PREFLIGHT_REBOOT_SHUTDOWN";
    MavCmd[MavCmd["MAV_CMD_OVERRIDE_GOTO"] = 252] = "MAV_CMD_OVERRIDE_GOTO";
    MavCmd[MavCmd["MAV_CMD_MISSION_START"] = 300] = "MAV_CMD_MISSION_START";
    MavCmd[MavCmd["MAV_CMD_COMPONENT_ARM_DISARM"] = 400] = "MAV_CMD_COMPONENT_ARM_DISARM";
    MavCmd[MavCmd["MAV_CMD_GET_HOME_POSITION"] = 410] = "MAV_CMD_GET_HOME_POSITION";
    MavCmd[MavCmd["MAV_CMD_START_RX_PAIR"] = 500] = "MAV_CMD_START_RX_PAIR";
    MavCmd[MavCmd["MAV_CMD_GET_MESSAGE_INTERVAL"] = 510] = "MAV_CMD_GET_MESSAGE_INTERVAL";
    MavCmd[MavCmd["MAV_CMD_SET_MESSAGE_INTERVAL"] = 511] = "MAV_CMD_SET_MESSAGE_INTERVAL";
    MavCmd[MavCmd["MAV_CMD_REQUEST_MESSAGE"] = 512] = "MAV_CMD_REQUEST_MESSAGE";
    MavCmd[MavCmd["MAV_CMD_REQUEST_AUTOPILOT_CAPABILITIES"] = 520] = "MAV_CMD_REQUEST_AUTOPILOT_CAPABILITIES";
    MavCmd[MavCmd["MAV_CMD_REQUEST_CAMERA_INFORMATION"] = 521] = "MAV_CMD_REQUEST_CAMERA_INFORMATION";
    MavCmd[MavCmd["MAV_CMD_REQUEST_CAMERA_SETTINGS"] = 522] = "MAV_CMD_REQUEST_CAMERA_SETTINGS";
    MavCmd[MavCmd["MAV_CMD_REQUEST_STORAGE_INFORMATION"] = 525] = "MAV_CMD_REQUEST_STORAGE_INFORMATION";
    MavCmd[MavCmd["MAV_CMD_STORAGE_FORMAT"] = 526] = "MAV_CMD_STORAGE_FORMAT";
    MavCmd[MavCmd["MAV_CMD_REQUEST_CAMERA_CAPTURE_STATUS"] = 527] = "MAV_CMD_REQUEST_CAMERA_CAPTURE_STATUS";
    MavCmd[MavCmd["MAV_CMD_REQUEST_FLIGHT_INFORMATION"] = 528] = "MAV_CMD_REQUEST_FLIGHT_INFORMATION";
    MavCmd[MavCmd["MAV_CMD_RESET_CAMERA_SETTINGS"] = 529] = "MAV_CMD_RESET_CAMERA_SETTINGS";
    MavCmd[MavCmd["MAV_CMD_SET_CAMERA_MODE"] = 530] = "MAV_CMD_SET_CAMERA_MODE";
    MavCmd[MavCmd["MAV_CMD_JUMP_TAG"] = 600] = "MAV_CMD_JUMP_TAG";
    MavCmd[MavCmd["MAV_CMD_DO_JUMP_TAG"] = 601] = "MAV_CMD_DO_JUMP_TAG";
    MavCmd[MavCmd["MAV_CMD_IMAGE_START_CAPTURE"] = 2000] = "MAV_CMD_IMAGE_START_CAPTURE";
    MavCmd[MavCmd["MAV_CMD_IMAGE_STOP_CAPTURE"] = 2001] = "MAV_CMD_IMAGE_STOP_CAPTURE";
    MavCmd[MavCmd["MAV_CMD_DO_TRIGGER_CONTROL"] = 2003] = "MAV_CMD_DO_TRIGGER_CONTROL";
    MavCmd[MavCmd["MAV_CMD_VIDEO_START_CAPTURE"] = 2500] = "MAV_CMD_VIDEO_START_CAPTURE";
    MavCmd[MavCmd["MAV_CMD_VIDEO_STOP_CAPTURE"] = 2501] = "MAV_CMD_VIDEO_STOP_CAPTURE";
    MavCmd[MavCmd["MAV_CMD_LOGGING_START"] = 2510] = "MAV_CMD_LOGGING_START";
    MavCmd[MavCmd["MAV_CMD_LOGGING_STOP"] = 2511] = "MAV_CMD_LOGGING_STOP";
    MavCmd[MavCmd["MAV_CMD_AIRFRAME_CONFIGURATION"] = 2520] = "MAV_CMD_AIRFRAME_CONFIGURATION";
    MavCmd[MavCmd["MAV_CMD_CONTROL_HIGH_LATENCY"] = 2600] = "MAV_CMD_CONTROL_HIGH_LATENCY";
    MavCmd[MavCmd["MAV_CMD_PANORAMA_CREATE"] = 2800] = "MAV_CMD_PANORAMA_CREATE";
    MavCmd[MavCmd["MAV_CMD_DO_VTOL_TRANSITION"] = 3000] = "MAV_CMD_DO_VTOL_TRANSITION";
    MavCmd[MavCmd["MAV_CMD_ARM_AUTHORIZATION_REQUEST"] = 3001] = "MAV_CMD_ARM_AUTHORIZATION_REQUEST";
    MavCmd[MavCmd["MAV_CMD_SET_GUIDED_SUBMODE_STANDARD"] = 4000] = "MAV_CMD_SET_GUIDED_SUBMODE_STANDARD";
    MavCmd[MavCmd["MAV_CMD_SET_GUIDED_SUBMODE_CIRCLE"] = 4001] = "MAV_CMD_SET_GUIDED_SUBMODE_CIRCLE";
    MavCmd[MavCmd["MAV_CMD_NAV_FENCE_RETURN_POINT"] = 5000] = "MAV_CMD_NAV_FENCE_RETURN_POINT";
    MavCmd[MavCmd["MAV_CMD_NAV_FENCE_POLYGON_VERTEX_INCLUSION"] = 5001] = "MAV_CMD_NAV_FENCE_POLYGON_VERTEX_INCLUSION";
    MavCmd[MavCmd["MAV_CMD_NAV_FENCE_POLYGON_VERTEX_EXCLUSION"] = 5002] = "MAV_CMD_NAV_FENCE_POLYGON_VERTEX_EXCLUSION";
    MavCmd[MavCmd["MAV_CMD_NAV_FENCE_CIRCLE_INCLUSION"] = 5003] = "MAV_CMD_NAV_FENCE_CIRCLE_INCLUSION";
    MavCmd[MavCmd["MAV_CMD_NAV_FENCE_CIRCLE_EXCLUSION"] = 5004] = "MAV_CMD_NAV_FENCE_CIRCLE_EXCLUSION";
    MavCmd[MavCmd["MAV_CMD_NAV_RALLY_POINT"] = 5100] = "MAV_CMD_NAV_RALLY_POINT";
    MavCmd[MavCmd["MAV_CMD_UAVCAN_GET_NODE_INFO"] = 5200] = "MAV_CMD_UAVCAN_GET_NODE_INFO";
    MavCmd[MavCmd["MAV_CMD_PAYLOAD_PREPARE_DEPLOY"] = 30001] = "MAV_CMD_PAYLOAD_PREPARE_DEPLOY";
    MavCmd[MavCmd["MAV_CMD_PAYLOAD_CONTROL_DEPLOY"] = 30002] = "MAV_CMD_PAYLOAD_CONTROL_DEPLOY";
    MavCmd[MavCmd["MAV_CMD_WAYPOINT_USER_1"] = 31000] = "MAV_CMD_WAYPOINT_USER_1";
    MavCmd[MavCmd["MAV_CMD_WAYPOINT_USER_2"] = 31001] = "MAV_CMD_WAYPOINT_USER_2";
    MavCmd[MavCmd["MAV_CMD_WAYPOINT_USER_3"] = 31002] = "MAV_CMD_WAYPOINT_USER_3";
    MavCmd[MavCmd["MAV_CMD_WAYPOINT_USER_4"] = 31003] = "MAV_CMD_WAYPOINT_USER_4";
    MavCmd[MavCmd["MAV_CMD_WAYPOINT_USER_5"] = 31004] = "MAV_CMD_WAYPOINT_USER_5";
    MavCmd[MavCmd["MAV_CMD_SPATIAL_USER_1"] = 31005] = "MAV_CMD_SPATIAL_USER_1";
    MavCmd[MavCmd["MAV_CMD_SPATIAL_USER_2"] = 31006] = "MAV_CMD_SPATIAL_USER_2";
    MavCmd[MavCmd["MAV_CMD_SPATIAL_USER_3"] = 31007] = "MAV_CMD_SPATIAL_USER_3";
    MavCmd[MavCmd["MAV_CMD_SPATIAL_USER_4"] = 31008] = "MAV_CMD_SPATIAL_USER_4";
    MavCmd[MavCmd["MAV_CMD_SPATIAL_USER_5"] = 31009] = "MAV_CMD_SPATIAL_USER_5";
    MavCmd[MavCmd["MAV_CMD_USER_1"] = 31010] = "MAV_CMD_USER_1";
    MavCmd[MavCmd["MAV_CMD_USER_2"] = 31011] = "MAV_CMD_USER_2";
    MavCmd[MavCmd["MAV_CMD_USER_3"] = 31012] = "MAV_CMD_USER_3";
    MavCmd[MavCmd["MAV_CMD_USER_4"] = 31013] = "MAV_CMD_USER_4";
    MavCmd[MavCmd["MAV_CMD_USER_5"] = 31014] = "MAV_CMD_USER_5";
    MavCmd[MavCmd["MAV_CMD_POWER_OFF_INITIATED"] = 42000] = "MAV_CMD_POWER_OFF_INITIATED";
    MavCmd[MavCmd["MAV_CMD_SOLO_BTN_FLY_CLICK"] = 42001] = "MAV_CMD_SOLO_BTN_FLY_CLICK";
    MavCmd[MavCmd["MAV_CMD_SOLO_BTN_FLY_HOLD"] = 42002] = "MAV_CMD_SOLO_BTN_FLY_HOLD";
    MavCmd[MavCmd["MAV_CMD_SOLO_BTN_PAUSE_CLICK"] = 42003] = "MAV_CMD_SOLO_BTN_PAUSE_CLICK";
    MavCmd[MavCmd["MAV_CMD_FIXED_MAG_CAL"] = 42004] = "MAV_CMD_FIXED_MAG_CAL";
    MavCmd[MavCmd["MAV_CMD_FIXED_MAG_CAL_FIELD"] = 42005] = "MAV_CMD_FIXED_MAG_CAL_FIELD";
    MavCmd[MavCmd["MAV_CMD_FIXED_MAG_CAL_YAW"] = 42006] = "MAV_CMD_FIXED_MAG_CAL_YAW";
    MavCmd[MavCmd["MAV_CMD_DO_START_MAG_CAL"] = 42424] = "MAV_CMD_DO_START_MAG_CAL";
    MavCmd[MavCmd["MAV_CMD_DO_ACCEPT_MAG_CAL"] = 42425] = "MAV_CMD_DO_ACCEPT_MAG_CAL";
    MavCmd[MavCmd["MAV_CMD_DO_CANCEL_MAG_CAL"] = 42426] = "MAV_CMD_DO_CANCEL_MAG_CAL";
    MavCmd[MavCmd["MAV_CMD_SET_FACTORY_TEST_MODE"] = 42427] = "MAV_CMD_SET_FACTORY_TEST_MODE";
    MavCmd[MavCmd["MAV_CMD_DO_SEND_BANNER"] = 42428] = "MAV_CMD_DO_SEND_BANNER";
    MavCmd[MavCmd["MAV_CMD_ACCELCAL_VEHICLE_POS"] = 42429] = "MAV_CMD_ACCELCAL_VEHICLE_POS";
    MavCmd[MavCmd["MAV_CMD_GIMBAL_RESET"] = 42501] = "MAV_CMD_GIMBAL_RESET";
    MavCmd[MavCmd["MAV_CMD_GIMBAL_AXIS_CALIBRATION_STATUS"] = 42502] = "MAV_CMD_GIMBAL_AXIS_CALIBRATION_STATUS";
    MavCmd[MavCmd["MAV_CMD_GIMBAL_REQUEST_AXIS_CALIBRATION"] = 42503] = "MAV_CMD_GIMBAL_REQUEST_AXIS_CALIBRATION";
    MavCmd[MavCmd["MAV_CMD_GIMBAL_FULL_RESET"] = 42505] = "MAV_CMD_GIMBAL_FULL_RESET";
    MavCmd[MavCmd["MAV_CMD_DO_WINCH"] = 42600] = "MAV_CMD_DO_WINCH";
    MavCmd[MavCmd["MAV_CMD_FLASH_BOOTLOADER"] = 42650] = "MAV_CMD_FLASH_BOOTLOADER";
    MavCmd[MavCmd["MAV_CMD_BATTERY_RESET"] = 42651] = "MAV_CMD_BATTERY_RESET";
    MavCmd[MavCmd["MAV_CMD_DEBUG_TRAP"] = 42700] = "MAV_CMD_DEBUG_TRAP";
    MavCmd[MavCmd["MAV_CMD_SCRIPTING"] = 42701] = "MAV_CMD_SCRIPTING";
    MavCmd[MavCmd["MAV_CMD_GUIDED_CHANGE_SPEED"] = 43000] = "MAV_CMD_GUIDED_CHANGE_SPEED";
    MavCmd[MavCmd["MAV_CMD_GUIDED_CHANGE_ALTITUDE"] = 43001] = "MAV_CMD_GUIDED_CHANGE_ALTITUDE";
    MavCmd[MavCmd["MAV_CMD_GUIDED_CHANGE_HEADING"] = 43002] = "MAV_CMD_GUIDED_CHANGE_HEADING";
    MavCmd[MavCmd["MAV_CMD_ENUM_END"] = 43003] = "MAV_CMD_ENUM_END";
})(MavCmd = exports.MavCmd || (exports.MavCmd = {}));