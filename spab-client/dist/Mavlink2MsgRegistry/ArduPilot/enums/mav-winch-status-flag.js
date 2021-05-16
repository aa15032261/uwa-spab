"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MavWinchStatusFlag = void 0;
var MavWinchStatusFlag;
(function (MavWinchStatusFlag) {
    MavWinchStatusFlag[MavWinchStatusFlag["MAV_WINCH_STATUS_HEALTHY"] = 1] = "MAV_WINCH_STATUS_HEALTHY";
    MavWinchStatusFlag[MavWinchStatusFlag["MAV_WINCH_STATUS_FULLY_RETRACTED"] = 2] = "MAV_WINCH_STATUS_FULLY_RETRACTED";
    MavWinchStatusFlag[MavWinchStatusFlag["MAV_WINCH_STATUS_MOVING"] = 4] = "MAV_WINCH_STATUS_MOVING";
    MavWinchStatusFlag[MavWinchStatusFlag["MAV_WINCH_STATUS_CLUTCH_ENGAGED"] = 8] = "MAV_WINCH_STATUS_CLUTCH_ENGAGED";
    MavWinchStatusFlag[MavWinchStatusFlag["MAV_WINCH_STATUS_FLAG_ENUM_END"] = 9] = "MAV_WINCH_STATUS_FLAG_ENUM_END";
})(MavWinchStatusFlag = exports.MavWinchStatusFlag || (exports.MavWinchStatusFlag = {}));
