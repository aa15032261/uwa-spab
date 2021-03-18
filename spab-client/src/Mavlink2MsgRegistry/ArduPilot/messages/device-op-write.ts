import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
import {DeviceOpBustype} from '../enums/device-op-bustype';
/*
Write registers for a device.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// request_id Request ID - copied to reply. uint32_t
// bustype The bus type. uint8_t
// bus Bus number. uint8_t
// address Bus address. uint8_t
// busname Name of device on bus (for SPI). char
// regstart First register to write. uint8_t
// count Count of registers to write. uint8_t
// data Write data. uint8_t
// bank Bank number. uint8_t
export class DeviceOpWrite extends MAVLinkMessage {
	public target_system!: number;
	public target_component!: number;
	public request_id!: number;
	public bustype!: DeviceOpBustype;
	public bus!: number;
	public address!: number;
	public busname!: string;
	public regstart!: number;
	public count!: number;
	public data!: number;
	public bank!: number;
	public _message_id: number = 11002;
	public _message_name: string = 'DEVICE_OP_WRITE';
	public _crc_extra: number = 234;
	public _message_fields: [string, string, boolean][] = [
		['request_id', 'uint32_t', false],
		['target_system', 'uint8_t', false],
		['target_component', 'uint8_t', false],
		['bustype', 'uint8_t', false],
		['bus', 'uint8_t', false],
		['address', 'uint8_t', false],
		['busname', 'char', false],
		['regstart', 'uint8_t', false],
		['count', 'uint8_t', false],
		['data', 'uint8_t', false],
		['bank', 'uint8_t', true],
	];
}