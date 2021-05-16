"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamMapRc = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Bind a RC channel to a parameter. The parameter should change according to the RC channel value.
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// param_id Onboard parameter id, terminated by NULL if the length is less than 16 human-readable chars and WITHOUT null termination (NULL) byte if the length is exactly 16 chars - applications have to provide 16+1 bytes storage if the ID is stored as string char
// param_index Parameter index. Send -1 to use the param ID field as identifier (else the param id will be ignored), send -2 to disable any existing map for this rc_channel_index. int16_t
// parameter_rc_channel_index Index of parameter RC channel. Not equal to the RC channel id. Typically corresponds to a potentiometer-knob on the RC. uint8_t
// param_value0 Initial parameter value float
// scale Scale, maps the RC range [-1, 1] to a parameter value float
// param_value_min Minimum param value. The protocol does not define if this overwrites an onboard minimum value. (Depends on implementation) float
// param_value_max Maximum param value. The protocol does not define if this overwrites an onboard maximum value. (Depends on implementation) float
class ParamMapRc extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 50;
        this._message_name = 'PARAM_MAP_RC';
        this._crc_extra = 78;
        this._message_fields = [
            ['param_value0', 'float', false],
            ['scale', 'float', false],
            ['param_value_min', 'float', false],
            ['param_value_max', 'float', false],
            ['param_index', 'int16_t', false],
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['param_id', 'char', false],
            ['parameter_rc_channel_index', 'uint8_t', false],
        ];
    }
}
exports.ParamMapRc = ParamMapRc;
