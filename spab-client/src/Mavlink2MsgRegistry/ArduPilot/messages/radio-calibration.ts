import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
/*
Complete set of calibration parameters for the radio
*/
// aileron Aileron setpoints: left, center, right uint16_t
// elevator Elevator setpoints: nose down, center, nose up uint16_t
// rudder Rudder setpoints: nose left, center, nose right uint16_t
// gyro Tail gyro mode/gain setpoints: heading hold, rate mode uint16_t
// pitch Pitch curve setpoints (every 25%) uint16_t
// throttle Throttle curve setpoints (every 25%) uint16_t
export class RadioCalibration extends MAVLinkMessage {
	public aileron!: number;
	public elevator!: number;
	public rudder!: number;
	public gyro!: number;
	public pitch!: number;
	public throttle!: number;
	public _message_id: number = 221;
	public _message_name: string = 'RADIO_CALIBRATION';
	public _crc_extra: number = 71;
	public _message_fields: [string, string, boolean][] = [
		['aileron', 'uint16_t', false],
		['elevator', 'uint16_t', false],
		['rudder', 'uint16_t', false],
		['gyro', 'uint16_t', false],
		['pitch', 'uint16_t', false],
		['throttle', 'uint16_t', false],
	];
}