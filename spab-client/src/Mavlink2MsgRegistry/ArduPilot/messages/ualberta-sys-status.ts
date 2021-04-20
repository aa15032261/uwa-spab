import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
/*
System status specific to ualberta uav
*/
// mode System mode, see UALBERTA_AUTOPILOT_MODE ENUM uint8_t
// nav_mode Navigation mode, see UALBERTA_NAV_MODE ENUM uint8_t
// pilot Pilot mode, see UALBERTA_PILOT_MODE uint8_t
export class UalbertaSysStatus extends MAVLinkMessage {
	public mode!: number;
	public nav_mode!: number;
	public pilot!: number;
	public _message_id: number = 222;
	public _message_name: string = 'UALBERTA_SYS_STATUS';
	public _crc_extra: number = 15;
	public _message_fields: [string, string, boolean][] = [
		['mode', 'uint8_t', false],
		['nav_mode', 'uint8_t', false],
		['pilot', 'uint8_t', false],
	];
}