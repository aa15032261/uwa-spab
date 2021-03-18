import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
/*
Status generated by radio.
*/
// rssi Local signal strength. uint8_t
// remrssi Remote signal strength. uint8_t
// txbuf How full the tx buffer is. uint8_t
// noise Background noise level. uint8_t
// remnoise Remote background noise level. uint8_t
// rxerrors Receive errors. uint16_t
// fixed Count of error corrected packets. uint16_t
export class Radio extends MAVLinkMessage {
	public rssi!: number;
	public remrssi!: number;
	public txbuf!: number;
	public noise!: number;
	public remnoise!: number;
	public rxerrors!: number;
	public fixed!: number;
	public _message_id: number = 166;
	public _message_name: string = 'RADIO';
	public _crc_extra: number = 21;
	public _message_fields: [string, string, boolean][] = [
		['rxerrors', 'uint16_t', false],
		['fixed', 'uint16_t', false],
		['rssi', 'uint8_t', false],
		['remrssi', 'uint8_t', false],
		['txbuf', 'uint8_t', false],
		['noise', 'uint8_t', false],
		['remnoise', 'uint8_t', false],
	];
}