"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OsdParamShowConfig = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Read a configured an OSD parameter slot.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// request_id Request ID - copied to reply. uint32_t
// osd_screen OSD parameter screen index. uint8_t
// osd_index OSD parameter display index. uint8_t
class OsdParamShowConfig extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 11035;
        this._message_name = 'OSD_PARAM_SHOW_CONFIG';
        this._crc_extra = 128;
        this._message_fields = [
            ['request_id', 'uint32_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['osd_screen', 'uint8_t', false],
            ['osd_index', 'uint8_t', false],
        ];
    }
}
exports.OsdParamShowConfig = OsdParamShowConfig;
