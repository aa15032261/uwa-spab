"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OsdParamConfig = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Configure an OSD parameter slot.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// request_id Request ID - copied to reply. uint32_t
// osd_screen OSD parameter screen index. uint8_t
// osd_index OSD parameter display index. uint8_t
// param_id Onboard parameter id, terminated by NULL if the length is less than 16 human-readable chars and WITHOUT null termination (NULL) byte if the length is exactly 16 chars - applications have to provide 16+1 bytes storage if the ID is stored as string char
// config_type Config type. uint8_t
// min_value OSD parameter minimum value. float
// max_value OSD parameter maximum value. float
// increment OSD parameter increment. float
class OsdParamConfig extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11033;
        this._message_name = 'OSD_PARAM_CONFIG';
        this._crc_extra = 195;
        this._message_fields = [
            ['request_id', 'uint32_t', false],
            ['min_value', 'float', false],
            ['max_value', 'float', false],
            ['increment', 'float', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['osd_screen', 'uint8_t', false],
            ['osd_index', 'uint8_t', false],
            ['param_id', 'char', false],
            ['config_type', 'uint8_t', false],
        ];
    }
}
exports.OsdParamConfig = OsdParamConfig;
