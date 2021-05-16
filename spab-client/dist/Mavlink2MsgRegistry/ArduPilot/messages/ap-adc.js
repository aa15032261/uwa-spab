"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApAdc = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Raw ADC output.
*/
// adc1 ADC output 1. uint16_t
// adc2 ADC output 2. uint16_t
// adc3 ADC output 3. uint16_t
// adc4 ADC output 4. uint16_t
// adc5 ADC output 5. uint16_t
// adc6 ADC output 6. uint16_t
class ApAdc extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 153;
        this._message_name = 'AP_ADC';
        this._crc_extra = 188;
        this._message_fields = [
            ['adc1', 'uint16_t', false],
            ['adc2', 'uint16_t', false],
            ['adc3', 'uint16_t', false],
            ['adc4', 'uint16_t', false],
            ['adc5', 'uint16_t', false],
            ['adc6', 'uint16_t', false],
        ];
    }
}
exports.ApAdc = ApAdc;
