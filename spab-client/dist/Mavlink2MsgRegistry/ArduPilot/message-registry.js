"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRegistry = void 0;
const sensor_offsets_1 = require("./messages/sensor-offsets");
const set_mag_offsets_1 = require("./messages/set-mag-offsets");
const meminfo_1 = require("./messages/meminfo");
const ap_adc_1 = require("./messages/ap-adc");
const digicam_configure_1 = require("./messages/digicam-configure");
const digicam_control_1 = require("./messages/digicam-control");
const mount_configure_1 = require("./messages/mount-configure");
const mount_control_1 = require("./messages/mount-control");
const mount_status_1 = require("./messages/mount-status");
const fence_point_1 = require("./messages/fence-point");
const fence_fetch_point_1 = require("./messages/fence-fetch-point");
const ahrs_1 = require("./messages/ahrs");
const simstate_1 = require("./messages/simstate");
const hwstatus_1 = require("./messages/hwstatus");
const radio_1 = require("./messages/radio");
const limits_status_1 = require("./messages/limits-status");
const wind_1 = require("./messages/wind");
const data16_1 = require("./messages/data16");
const data32_1 = require("./messages/data32");
const data64_1 = require("./messages/data64");
const data96_1 = require("./messages/data96");
const rangefinder_1 = require("./messages/rangefinder");
const airspeed_autocal_1 = require("./messages/airspeed-autocal");
const rally_point_1 = require("./messages/rally-point");
const rally_fetch_point_1 = require("./messages/rally-fetch-point");
const compassmot_status_1 = require("./messages/compassmot-status");
const ahrs2_1 = require("./messages/ahrs2");
const camera_status_1 = require("./messages/camera-status");
const camera_feedback_1 = require("./messages/camera-feedback");
const battery2_1 = require("./messages/battery2");
const ahrs3_1 = require("./messages/ahrs3");
const autopilot_version_request_1 = require("./messages/autopilot-version-request");
const remote_log_data_block_1 = require("./messages/remote-log-data-block");
const remote_log_block_status_1 = require("./messages/remote-log-block-status");
const led_control_1 = require("./messages/led-control");
const mag_cal_progress_1 = require("./messages/mag-cal-progress");
const mag_cal_report_1 = require("./messages/mag-cal-report");
const ekf_status_report_1 = require("./messages/ekf-status-report");
const pid_tuning_1 = require("./messages/pid-tuning");
const deepstall_1 = require("./messages/deepstall");
const gimbal_report_1 = require("./messages/gimbal-report");
const gimbal_control_1 = require("./messages/gimbal-control");
const gimbal_torque_cmd_report_1 = require("./messages/gimbal-torque-cmd-report");
const gopro_heartbeat_1 = require("./messages/gopro-heartbeat");
const gopro_get_request_1 = require("./messages/gopro-get-request");
const gopro_get_response_1 = require("./messages/gopro-get-response");
const gopro_set_request_1 = require("./messages/gopro-set-request");
const gopro_set_response_1 = require("./messages/gopro-set-response");
const efi_status_1 = require("./messages/efi-status");
const rpm_1 = require("./messages/rpm");
const device_op_read_1 = require("./messages/device-op-read");
const device_op_read_reply_1 = require("./messages/device-op-read-reply");
const device_op_write_1 = require("./messages/device-op-write");
const device_op_write_reply_1 = require("./messages/device-op-write-reply");
const adap_tuning_1 = require("./messages/adap-tuning");
const vision_position_delta_1 = require("./messages/vision-position-delta");
const aoa_ssa_1 = require("./messages/aoa-ssa");
const esc_telemetry_1_to_4_1 = require("./messages/esc-telemetry-1-to-4");
const esc_telemetry_5_to_8_1 = require("./messages/esc-telemetry-5-to-8");
const esc_telemetry_9_to_12_1 = require("./messages/esc-telemetry-9-to-12");
const osd_param_config_1 = require("./messages/osd-param-config");
const osd_param_config_reply_1 = require("./messages/osd-param-config-reply");
const osd_param_show_config_1 = require("./messages/osd-param-show-config");
const osd_param_show_config_reply_1 = require("./messages/osd-param-show-config-reply");
const heartbeat_1 = require("./messages/heartbeat");
const sys_status_1 = require("./messages/sys-status");
const system_time_1 = require("./messages/system-time");
const ping_1 = require("./messages/ping");
const change_operator_control_1 = require("./messages/change-operator-control");
const change_operator_control_ack_1 = require("./messages/change-operator-control-ack");
const auth_key_1 = require("./messages/auth-key");
const set_mode_1 = require("./messages/set-mode");
const param_request_read_1 = require("./messages/param-request-read");
const param_request_list_1 = require("./messages/param-request-list");
const param_value_1 = require("./messages/param-value");
const param_set_1 = require("./messages/param-set");
const gps_raw_int_1 = require("./messages/gps-raw-int");
const gps_status_1 = require("./messages/gps-status");
const scaled_imu_1 = require("./messages/scaled-imu");
const raw_imu_1 = require("./messages/raw-imu");
const raw_pressure_1 = require("./messages/raw-pressure");
const scaled_pressure_1 = require("./messages/scaled-pressure");
const attitude_1 = require("./messages/attitude");
const attitude_quaternion_1 = require("./messages/attitude-quaternion");
const local_position_ned_1 = require("./messages/local-position-ned");
const global_position_int_1 = require("./messages/global-position-int");
const rc_channels_scaled_1 = require("./messages/rc-channels-scaled");
const rc_channels_raw_1 = require("./messages/rc-channels-raw");
const servo_output_raw_1 = require("./messages/servo-output-raw");
const mission_request_partial_list_1 = require("./messages/mission-request-partial-list");
const mission_write_partial_list_1 = require("./messages/mission-write-partial-list");
const mission_item_1 = require("./messages/mission-item");
const mission_request_1 = require("./messages/mission-request");
const mission_set_current_1 = require("./messages/mission-set-current");
const mission_current_1 = require("./messages/mission-current");
const mission_request_list_1 = require("./messages/mission-request-list");
const mission_count_1 = require("./messages/mission-count");
const mission_clear_all_1 = require("./messages/mission-clear-all");
const mission_item_reached_1 = require("./messages/mission-item-reached");
const mission_ack_1 = require("./messages/mission-ack");
const set_gps_global_origin_1 = require("./messages/set-gps-global-origin");
const gps_global_origin_1 = require("./messages/gps-global-origin");
const param_map_rc_1 = require("./messages/param-map-rc");
const mission_request_int_1 = require("./messages/mission-request-int");
const safety_set_allowed_area_1 = require("./messages/safety-set-allowed-area");
const safety_allowed_area_1 = require("./messages/safety-allowed-area");
const attitude_quaternion_cov_1 = require("./messages/attitude-quaternion-cov");
const nav_controller_output_1 = require("./messages/nav-controller-output");
const global_position_int_cov_1 = require("./messages/global-position-int-cov");
const local_position_ned_cov_1 = require("./messages/local-position-ned-cov");
const rc_channels_1 = require("./messages/rc-channels");
const request_data_stream_1 = require("./messages/request-data-stream");
const data_stream_1 = require("./messages/data-stream");
const manual_control_1 = require("./messages/manual-control");
const rc_channels_override_1 = require("./messages/rc-channels-override");
const mission_item_int_1 = require("./messages/mission-item-int");
const vfr_hud_1 = require("./messages/vfr-hud");
const command_int_1 = require("./messages/command-int");
const command_long_1 = require("./messages/command-long");
const command_ack_1 = require("./messages/command-ack");
const manual_setpoint_1 = require("./messages/manual-setpoint");
const set_attitude_target_1 = require("./messages/set-attitude-target");
const attitude_target_1 = require("./messages/attitude-target");
const set_position_target_local_ned_1 = require("./messages/set-position-target-local-ned");
const position_target_local_ned_1 = require("./messages/position-target-local-ned");
const set_position_target_global_int_1 = require("./messages/set-position-target-global-int");
const position_target_global_int_1 = require("./messages/position-target-global-int");
const local_position_ned_system_global_offset_1 = require("./messages/local-position-ned-system-global-offset");
const hil_state_1 = require("./messages/hil-state");
const hil_controls_1 = require("./messages/hil-controls");
const hil_rc_inputs_raw_1 = require("./messages/hil-rc-inputs-raw");
const hil_actuator_controls_1 = require("./messages/hil-actuator-controls");
const optical_flow_1 = require("./messages/optical-flow");
const global_vision_position_estimate_1 = require("./messages/global-vision-position-estimate");
const vision_position_estimate_1 = require("./messages/vision-position-estimate");
const vision_speed_estimate_1 = require("./messages/vision-speed-estimate");
const vicon_position_estimate_1 = require("./messages/vicon-position-estimate");
const highres_imu_1 = require("./messages/highres-imu");
const optical_flow_rad_1 = require("./messages/optical-flow-rad");
const hil_sensor_1 = require("./messages/hil-sensor");
const sim_state_1 = require("./messages/sim-state");
const radio_status_1 = require("./messages/radio-status");
const file_transfer_protocol_1 = require("./messages/file-transfer-protocol");
const timesync_1 = require("./messages/timesync");
const camera_trigger_1 = require("./messages/camera-trigger");
const hil_gps_1 = require("./messages/hil-gps");
const hil_optical_flow_1 = require("./messages/hil-optical-flow");
const hil_state_quaternion_1 = require("./messages/hil-state-quaternion");
const scaled_imu2_1 = require("./messages/scaled-imu2");
const log_request_list_1 = require("./messages/log-request-list");
const log_entry_1 = require("./messages/log-entry");
const log_request_data_1 = require("./messages/log-request-data");
const log_data_1 = require("./messages/log-data");
const log_erase_1 = require("./messages/log-erase");
const log_request_end_1 = require("./messages/log-request-end");
const gps_inject_data_1 = require("./messages/gps-inject-data");
const gps2_raw_1 = require("./messages/gps2-raw");
const power_status_1 = require("./messages/power-status");
const serial_control_1 = require("./messages/serial-control");
const gps_rtk_1 = require("./messages/gps-rtk");
const gps2_rtk_1 = require("./messages/gps2-rtk");
const scaled_imu3_1 = require("./messages/scaled-imu3");
const data_transmission_handshake_1 = require("./messages/data-transmission-handshake");
const encapsulated_data_1 = require("./messages/encapsulated-data");
const distance_sensor_1 = require("./messages/distance-sensor");
const terrain_request_1 = require("./messages/terrain-request");
const terrain_data_1 = require("./messages/terrain-data");
const terrain_check_1 = require("./messages/terrain-check");
const terrain_report_1 = require("./messages/terrain-report");
const scaled_pressure2_1 = require("./messages/scaled-pressure2");
const att_pos_mocap_1 = require("./messages/att-pos-mocap");
const set_actuator_control_target_1 = require("./messages/set-actuator-control-target");
const actuator_control_target_1 = require("./messages/actuator-control-target");
const altitude_1 = require("./messages/altitude");
const resource_request_1 = require("./messages/resource-request");
const scaled_pressure3_1 = require("./messages/scaled-pressure3");
const follow_target_1 = require("./messages/follow-target");
const control_system_state_1 = require("./messages/control-system-state");
const battery_status_1 = require("./messages/battery-status");
const autopilot_version_1 = require("./messages/autopilot-version");
const landing_target_1 = require("./messages/landing-target");
const fence_status_1 = require("./messages/fence-status");
const estimator_status_1 = require("./messages/estimator-status");
const wind_cov_1 = require("./messages/wind-cov");
const gps_input_1 = require("./messages/gps-input");
const gps_rtcm_data_1 = require("./messages/gps-rtcm-data");
const high_latency_1 = require("./messages/high-latency");
const vibration_1 = require("./messages/vibration");
const home_position_1 = require("./messages/home-position");
const set_home_position_1 = require("./messages/set-home-position");
const message_interval_1 = require("./messages/message-interval");
const extended_sys_state_1 = require("./messages/extended-sys-state");
const adsb_vehicle_1 = require("./messages/adsb-vehicle");
const collision_1 = require("./messages/collision");
const v2_extension_1 = require("./messages/v2-extension");
const memory_vect_1 = require("./messages/memory-vect");
const debug_vect_1 = require("./messages/debug-vect");
const named_value_float_1 = require("./messages/named-value-float");
const named_value_int_1 = require("./messages/named-value-int");
const statustext_1 = require("./messages/statustext");
const debug_1 = require("./messages/debug");
const setup_signing_1 = require("./messages/setup-signing");
const button_change_1 = require("./messages/button-change");
const play_tune_1 = require("./messages/play-tune");
const camera_information_1 = require("./messages/camera-information");
const camera_settings_1 = require("./messages/camera-settings");
const storage_information_1 = require("./messages/storage-information");
const camera_capture_status_1 = require("./messages/camera-capture-status");
const camera_image_captured_1 = require("./messages/camera-image-captured");
const flight_information_1 = require("./messages/flight-information");
const mount_orientation_1 = require("./messages/mount-orientation");
const logging_data_1 = require("./messages/logging-data");
const logging_data_acked_1 = require("./messages/logging-data-acked");
const logging_ack_1 = require("./messages/logging-ack");
const wifi_config_ap_1 = require("./messages/wifi-config-ap");
const ais_vessel_1 = require("./messages/ais-vessel");
const uavcan_node_status_1 = require("./messages/uavcan-node-status");
const uavcan_node_info_1 = require("./messages/uavcan-node-info");
const obstacle_distance_1 = require("./messages/obstacle-distance");
const odometry_1 = require("./messages/odometry");
const isbd_link_status_1 = require("./messages/isbd-link-status");
const debug_float_array_1 = require("./messages/debug-float-array");
const generator_status_1 = require("./messages/generator-status");
const actuator_output_status_1 = require("./messages/actuator-output-status");
const wheel_distance_1 = require("./messages/wheel-distance");
const winch_status_1 = require("./messages/winch-status");
const icarous_heartbeat_1 = require("./messages/icarous-heartbeat");
const icarous_kinematic_bands_1 = require("./messages/icarous-kinematic-bands");
const nav_filter_bias_1 = require("./messages/nav-filter-bias");
const radio_calibration_1 = require("./messages/radio-calibration");
const ualberta_sys_status_1 = require("./messages/ualberta-sys-status");
const uavionix_adsb_out_cfg_1 = require("./messages/uavionix-adsb-out-cfg");
const uavionix_adsb_out_dynamic_1 = require("./messages/uavionix-adsb-out-dynamic");
const uavionix_adsb_transceiver_health_report_1 = require("./messages/uavionix-adsb-transceiver-health-report");
exports.messageRegistry = [
    [150, sensor_offsets_1.SensorOffsets],
    [151, set_mag_offsets_1.SetMagOffsets],
    [152, meminfo_1.Meminfo],
    [153, ap_adc_1.ApAdc],
    [154, digicam_configure_1.DigicamConfigure],
    [155, digicam_control_1.DigicamControl],
    [156, mount_configure_1.MountConfigure],
    [157, mount_control_1.MountControl],
    [158, mount_status_1.MountStatus],
    [160, fence_point_1.FencePoint],
    [161, fence_fetch_point_1.FenceFetchPoint],
    [163, ahrs_1.Ahrs],
    [164, simstate_1.Simstate],
    [165, hwstatus_1.Hwstatus],
    [166, radio_1.Radio],
    [167, limits_status_1.LimitsStatus],
    [168, wind_1.Wind],
    [169, data16_1.Data16],
    [170, data32_1.Data32],
    [171, data64_1.Data64],
    [172, data96_1.Data96],
    [173, rangefinder_1.Rangefinder],
    [174, airspeed_autocal_1.AirspeedAutocal],
    [175, rally_point_1.RallyPoint],
    [176, rally_fetch_point_1.RallyFetchPoint],
    [177, compassmot_status_1.CompassmotStatus],
    [178, ahrs2_1.Ahrs2],
    [179, camera_status_1.CameraStatus],
    [180, camera_feedback_1.CameraFeedback],
    [181, battery2_1.Battery2],
    [182, ahrs3_1.Ahrs3],
    [183, autopilot_version_request_1.AutopilotVersionRequest],
    [184, remote_log_data_block_1.RemoteLogDataBlock],
    [185, remote_log_block_status_1.RemoteLogBlockStatus],
    [186, led_control_1.LedControl],
    [191, mag_cal_progress_1.MagCalProgress],
    [192, mag_cal_report_1.MagCalReport],
    [193, ekf_status_report_1.EkfStatusReport],
    [194, pid_tuning_1.PidTuning],
    [195, deepstall_1.Deepstall],
    [200, gimbal_report_1.GimbalReport],
    [201, gimbal_control_1.GimbalControl],
    [214, gimbal_torque_cmd_report_1.GimbalTorqueCmdReport],
    [215, gopro_heartbeat_1.GoproHeartbeat],
    [216, gopro_get_request_1.GoproGetRequest],
    [217, gopro_get_response_1.GoproGetResponse],
    [218, gopro_set_request_1.GoproSetRequest],
    [219, gopro_set_response_1.GoproSetResponse],
    [225, efi_status_1.EfiStatus],
    [226, rpm_1.Rpm],
    [11000, device_op_read_1.DeviceOpRead],
    [11001, device_op_read_reply_1.DeviceOpReadReply],
    [11002, device_op_write_1.DeviceOpWrite],
    [11003, device_op_write_reply_1.DeviceOpWriteReply],
    [11010, adap_tuning_1.AdapTuning],
    [11011, vision_position_delta_1.VisionPositionDelta],
    [11020, aoa_ssa_1.AoaSsa],
    [11030, esc_telemetry_1_to_4_1.EscTelemetry1To4],
    [11031, esc_telemetry_5_to_8_1.EscTelemetry5To8],
    [11032, esc_telemetry_9_to_12_1.EscTelemetry9To12],
    [11033, osd_param_config_1.OsdParamConfig],
    [11034, osd_param_config_reply_1.OsdParamConfigReply],
    [11035, osd_param_show_config_1.OsdParamShowConfig],
    [11036, osd_param_show_config_reply_1.OsdParamShowConfigReply],
    [0, heartbeat_1.Heartbeat],
    [1, sys_status_1.SysStatus],
    [2, system_time_1.SystemTime],
    [4, ping_1.Ping],
    [5, change_operator_control_1.ChangeOperatorControl],
    [6, change_operator_control_ack_1.ChangeOperatorControlAck],
    [7, auth_key_1.AuthKey],
    [11, set_mode_1.SetMode],
    [20, param_request_read_1.ParamRequestRead],
    [21, param_request_list_1.ParamRequestList],
    [22, param_value_1.ParamValue],
    [23, param_set_1.ParamSet],
    [24, gps_raw_int_1.GpsRawInt],
    [25, gps_status_1.GpsStatus],
    [26, scaled_imu_1.ScaledImu],
    [27, raw_imu_1.RawImu],
    [28, raw_pressure_1.RawPressure],
    [29, scaled_pressure_1.ScaledPressure],
    [30, attitude_1.Attitude],
    [31, attitude_quaternion_1.AttitudeQuaternion],
    [32, local_position_ned_1.LocalPositionNed],
    [33, global_position_int_1.GlobalPositionInt],
    [34, rc_channels_scaled_1.RcChannelsScaled],
    [35, rc_channels_raw_1.RcChannelsRaw],
    [36, servo_output_raw_1.ServoOutputRaw],
    [37, mission_request_partial_list_1.MissionRequestPartialList],
    [38, mission_write_partial_list_1.MissionWritePartialList],
    [39, mission_item_1.MissionItem],
    [40, mission_request_1.MissionRequest],
    [41, mission_set_current_1.MissionSetCurrent],
    [42, mission_current_1.MissionCurrent],
    [43, mission_request_list_1.MissionRequestList],
    [44, mission_count_1.MissionCount],
    [45, mission_clear_all_1.MissionClearAll],
    [46, mission_item_reached_1.MissionItemReached],
    [47, mission_ack_1.MissionAck],
    [48, set_gps_global_origin_1.SetGpsGlobalOrigin],
    [49, gps_global_origin_1.GpsGlobalOrigin],
    [50, param_map_rc_1.ParamMapRc],
    [51, mission_request_int_1.MissionRequestInt],
    [54, safety_set_allowed_area_1.SafetySetAllowedArea],
    [55, safety_allowed_area_1.SafetyAllowedArea],
    [61, attitude_quaternion_cov_1.AttitudeQuaternionCov],
    [62, nav_controller_output_1.NavControllerOutput],
    [63, global_position_int_cov_1.GlobalPositionIntCov],
    [64, local_position_ned_cov_1.LocalPositionNedCov],
    [65, rc_channels_1.RcChannels],
    [66, request_data_stream_1.RequestDataStream],
    [67, data_stream_1.DataStream],
    [69, manual_control_1.ManualControl],
    [70, rc_channels_override_1.RcChannelsOverride],
    [73, mission_item_int_1.MissionItemInt],
    [74, vfr_hud_1.VfrHud],
    [75, command_int_1.CommandInt],
    [76, command_long_1.CommandLong],
    [77, command_ack_1.CommandAck],
    [81, manual_setpoint_1.ManualSetpoint],
    [82, set_attitude_target_1.SetAttitudeTarget],
    [83, attitude_target_1.AttitudeTarget],
    [84, set_position_target_local_ned_1.SetPositionTargetLocalNed],
    [85, position_target_local_ned_1.PositionTargetLocalNed],
    [86, set_position_target_global_int_1.SetPositionTargetGlobalInt],
    [87, position_target_global_int_1.PositionTargetGlobalInt],
    [89, local_position_ned_system_global_offset_1.LocalPositionNedSystemGlobalOffset],
    [90, hil_state_1.HilState],
    [91, hil_controls_1.HilControls],
    [92, hil_rc_inputs_raw_1.HilRcInputsRaw],
    [93, hil_actuator_controls_1.HilActuatorControls],
    [100, optical_flow_1.OpticalFlow],
    [101, global_vision_position_estimate_1.GlobalVisionPositionEstimate],
    [102, vision_position_estimate_1.VisionPositionEstimate],
    [103, vision_speed_estimate_1.VisionSpeedEstimate],
    [104, vicon_position_estimate_1.ViconPositionEstimate],
    [105, highres_imu_1.HighresImu],
    [106, optical_flow_rad_1.OpticalFlowRad],
    [107, hil_sensor_1.HilSensor],
    [108, sim_state_1.SimState],
    [109, radio_status_1.RadioStatus],
    [110, file_transfer_protocol_1.FileTransferProtocol],
    [111, timesync_1.Timesync],
    [112, camera_trigger_1.CameraTrigger],
    [113, hil_gps_1.HilGps],
    [114, hil_optical_flow_1.HilOpticalFlow],
    [115, hil_state_quaternion_1.HilStateQuaternion],
    [116, scaled_imu2_1.ScaledImu2],
    [117, log_request_list_1.LogRequestList],
    [118, log_entry_1.LogEntry],
    [119, log_request_data_1.LogRequestData],
    [120, log_data_1.LogData],
    [121, log_erase_1.LogErase],
    [122, log_request_end_1.LogRequestEnd],
    [123, gps_inject_data_1.GpsInjectData],
    [124, gps2_raw_1.Gps2Raw],
    [125, power_status_1.PowerStatus],
    [126, serial_control_1.SerialControl],
    [127, gps_rtk_1.GpsRtk],
    [128, gps2_rtk_1.Gps2Rtk],
    [129, scaled_imu3_1.ScaledImu3],
    [130, data_transmission_handshake_1.DataTransmissionHandshake],
    [131, encapsulated_data_1.EncapsulatedData],
    [132, distance_sensor_1.DistanceSensor],
    [133, terrain_request_1.TerrainRequest],
    [134, terrain_data_1.TerrainData],
    [135, terrain_check_1.TerrainCheck],
    [136, terrain_report_1.TerrainReport],
    [137, scaled_pressure2_1.ScaledPressure2],
    [138, att_pos_mocap_1.AttPosMocap],
    [139, set_actuator_control_target_1.SetActuatorControlTarget],
    [140, actuator_control_target_1.ActuatorControlTarget],
    [141, altitude_1.Altitude],
    [142, resource_request_1.ResourceRequest],
    [143, scaled_pressure3_1.ScaledPressure3],
    [144, follow_target_1.FollowTarget],
    [146, control_system_state_1.ControlSystemState],
    [147, battery_status_1.BatteryStatus],
    [148, autopilot_version_1.AutopilotVersion],
    [149, landing_target_1.LandingTarget],
    [162, fence_status_1.FenceStatus],
    [230, estimator_status_1.EstimatorStatus],
    [231, wind_cov_1.WindCov],
    [232, gps_input_1.GpsInput],
    [233, gps_rtcm_data_1.GpsRtcmData],
    [234, high_latency_1.HighLatency],
    [241, vibration_1.Vibration],
    [242, home_position_1.HomePosition],
    [243, set_home_position_1.SetHomePosition],
    [244, message_interval_1.MessageInterval],
    [245, extended_sys_state_1.ExtendedSysState],
    [246, adsb_vehicle_1.AdsbVehicle],
    [247, collision_1.Collision],
    [248, v2_extension_1.V2Extension],
    [249, memory_vect_1.MemoryVect],
    [250, debug_vect_1.DebugVect],
    [251, named_value_float_1.NamedValueFloat],
    [252, named_value_int_1.NamedValueInt],
    [253, statustext_1.Statustext],
    [254, debug_1.Debug],
    [256, setup_signing_1.SetupSigning],
    [257, button_change_1.ButtonChange],
    [258, play_tune_1.PlayTune],
    [259, camera_information_1.CameraInformation],
    [260, camera_settings_1.CameraSettings],
    [261, storage_information_1.StorageInformation],
    [262, camera_capture_status_1.CameraCaptureStatus],
    [263, camera_image_captured_1.CameraImageCaptured],
    [264, flight_information_1.FlightInformation],
    [265, mount_orientation_1.MountOrientation],
    [266, logging_data_1.LoggingData],
    [267, logging_data_acked_1.LoggingDataAcked],
    [268, logging_ack_1.LoggingAck],
    [299, wifi_config_ap_1.WifiConfigAp],
    [301, ais_vessel_1.AisVessel],
    [310, uavcan_node_status_1.UavcanNodeStatus],
    [311, uavcan_node_info_1.UavcanNodeInfo],
    [330, obstacle_distance_1.ObstacleDistance],
    [331, odometry_1.Odometry],
    [335, isbd_link_status_1.IsbdLinkStatus],
    [350, debug_float_array_1.DebugFloatArray],
    [373, generator_status_1.GeneratorStatus],
    [375, actuator_output_status_1.ActuatorOutputStatus],
    [9000, wheel_distance_1.WheelDistance],
    [9005, winch_status_1.WinchStatus],
    [42000, icarous_heartbeat_1.IcarousHeartbeat],
    [42001, icarous_kinematic_bands_1.IcarousKinematicBands],
    [220, nav_filter_bias_1.NavFilterBias],
    [221, radio_calibration_1.RadioCalibration],
    [222, ualberta_sys_status_1.UalbertaSysStatus],
    [10001, uavionix_adsb_out_cfg_1.UavionixAdsbOutCfg],
    [10002, uavionix_adsb_out_dynamic_1.UavionixAdsbOutDynamic],
    [10003, uavionix_adsb_transceiver_health_report_1.UavionixAdsbTransceiverHealthReport],
];
