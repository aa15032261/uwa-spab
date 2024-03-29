"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UavcanNodeInfo = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
General information describing a particular UAVCAN node. Please refer to the definition of the UAVCAN service "uavcan.protocol.GetNodeInfo" for the background information. This message should be emitted by the system whenever a new node appears online, or an existing node reboots. Additionally, it can be emitted upon request from the other end of the MAVLink channel (see MAV_CMD_UAVCAN_GET_NODE_INFO). It is also not prohibited to emit this message unconditionally at a low frequency. The UAVCAN specification is available at http://uavcan.org.
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// uptime_sec Time since the start-up of the node. uint32_t
// name Node name string. For example, "sapog.px4.io". char
// hw_version_major Hardware major version number. uint8_t
// hw_version_minor Hardware minor version number. uint8_t
// hw_unique_id Hardware unique 128-bit ID. uint8_t
// sw_version_major Software major version number. uint8_t
// sw_version_minor Software minor version number. uint8_t
// sw_vcs_commit Version control system (VCS) revision identifier (e.g. git short commit hash). Zero if unknown. uint32_t
class UavcanNodeInfo extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 311;
        this._message_name = 'UAVCAN_NODE_INFO';
        this._crc_extra = 95;
        this._message_fields = [
            ['time_usec', 'uint64_t', false],
            ['uptime_sec', 'uint32_t', false],
            ['sw_vcs_commit', 'uint32_t', false],
            ['name', 'char', false],
            ['hw_version_major', 'uint8_t', false],
            ['hw_version_minor', 'uint8_t', false],
            ['hw_unique_id', 'uint8_t', false],
            ['sw_version_major', 'uint8_t', false],
            ['sw_version_minor', 'uint8_t', false],
        ];
    }
}
exports.UavcanNodeInfo = UavcanNodeInfo;
