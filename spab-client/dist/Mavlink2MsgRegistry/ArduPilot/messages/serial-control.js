"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialControl = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Control a serial port. This can be used for raw access to an onboard serial peripheral such as a GPS or telemetry radio. It is designed to make it possible to update the devices firmware via MAVLink messages or change the devices settings. A message with zero bytes can be used to change just the baudrate.
*/
// device Serial control device type. uint8_t
// flags Bitmap of serial control flags. uint8_t
// timeout Timeout for reply data uint16_t
// baudrate Baudrate of transfer. Zero means no change. uint32_t
// count how many bytes in this transfer uint8_t
// data serial data uint8_t
class SerialControl extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 126;
        this._message_name = 'SERIAL_CONTROL';
        this._crc_extra = 220;
        this._message_fields = [
            ['baudrate', 'uint32_t', false],
            ['timeout', 'uint16_t', false],
            ['device', 'uint8_t', false],
            ['flags', 'uint8_t', false],
            ['count', 'uint8_t', false],
            ['data', 'uint8_t', false],
        ];
    }
}
exports.SerialControl = SerialControl;
