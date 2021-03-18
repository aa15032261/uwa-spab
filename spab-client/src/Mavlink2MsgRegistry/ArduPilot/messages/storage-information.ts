import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
import {StorageStatus} from '../enums/storage-status';
/*
Information about a storage medium. This message is sent in response to a request and whenever the status of the storage changes (STORAGE_STATUS).
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// storage_id Storage ID (1 for first, 2 for second, etc.) uint8_t
// storage_count Number of storage devices uint8_t
// status Status of storage uint8_t
// total_capacity Total capacity. If storage is not ready (STORAGE_STATUS_READY) value will be ignored. float
// used_capacity Used capacity. If storage is not ready (STORAGE_STATUS_READY) value will be ignored. float
// available_capacity Available storage capacity. If storage is not ready (STORAGE_STATUS_READY) value will be ignored. float
// read_speed Read speed. float
// write_speed Write speed. float
export class StorageInformation extends MAVLinkMessage {
	public time_boot_ms!: number;
	public storage_id!: number;
	public storage_count!: number;
	public status!: StorageStatus;
	public total_capacity!: number;
	public used_capacity!: number;
	public available_capacity!: number;
	public read_speed!: number;
	public write_speed!: number;
	public _message_id: number = 261;
	public _message_name: string = 'STORAGE_INFORMATION';
	public _crc_extra: number = 179;
	public _message_fields: [string, string, boolean][] = [
		['time_boot_ms', 'uint32_t', false],
		['total_capacity', 'float', false],
		['used_capacity', 'float', false],
		['available_capacity', 'float', false],
		['read_speed', 'float', false],
		['write_speed', 'float', false],
		['storage_id', 'uint8_t', false],
		['storage_count', 'uint8_t', false],
		['status', 'uint8_t', false],
	];
}