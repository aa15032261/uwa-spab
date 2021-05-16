"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UavionixAdsbTransceiverHealthReport = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Transceiver heartbeat with health report (updated every 10s)
*/
// rfHealth ADS-B transponder messages uint8_t
class UavionixAdsbTransceiverHealthReport extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 10003;
        this._message_name = 'UAVIONIX_ADSB_TRANSCEIVER_HEALTH_REPORT';
        this._crc_extra = 4;
        this._message_fields = [
            ['rfHealth', 'uint8_t', false],
        ];
    }
}
exports.UavionixAdsbTransceiverHealthReport = UavionixAdsbTransceiverHealthReport;
