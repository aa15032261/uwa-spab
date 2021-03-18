import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
/*
Configure AP SSID and Password.
*/
// ssid Name of Wi-Fi network (SSID). Leave it blank to leave it unchanged. char
// password Password. Leave it blank for an open AP. char
export class WifiConfigAp extends MAVLinkMessage {
	public ssid!: string;
	public password!: string;
	public _message_id: number = 299;
	public _message_name: string = 'WIFI_CONFIG_AP';
	public _crc_extra: number = 19;
	public _message_fields: [string, string, boolean][] = [
		['ssid', 'char', false],
		['password', 'char', false],
	];
}