"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamRequestList = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Request all parameters of this component. After this request, all parameters are emitted. The parameter microservice is documented at https://mavlink.io/en/services/parameter.html
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
class ParamRequestList extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 21;
        this._message_name = 'PARAM_REQUEST_LIST';
        this._crc_extra = 159;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
        ];
    }
}
exports.ParamRequestList = ParamRequestList;
