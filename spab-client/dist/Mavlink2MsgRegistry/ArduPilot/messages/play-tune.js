"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayTune = void 0;
const node_mavlink_1 = require("@ifrunistuttgart/node-mavlink");
/*
Control vehicle tone generation (buzzer)
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// tune tune in board specific format char
// tune2 tune extension (appended to tune) char
class PlayTune extends node_mavlink_1.MAVLinkMessage {
    constructor() {
        super(...arguments);
        this._message_id = 258;
        this._message_name = 'PLAY_TUNE';
        this._crc_extra = 187;
        this._message_fields = [
            ['target_system', 'uint8_t', false],
            ['target_component', 'uint8_t', false],
            ['tune', 'char', false],
            ['tune2', 'char', true],
        ];
    }
}
exports.PlayTune = PlayTune;
