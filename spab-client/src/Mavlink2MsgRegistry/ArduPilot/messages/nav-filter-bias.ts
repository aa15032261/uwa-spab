import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
/*
Accelerometer and Gyro biases from the navigation filter
*/
// usec Timestamp (microseconds) uint64_t
// accel_0 b_f[0] float
// accel_1 b_f[1] float
// accel_2 b_f[2] float
// gyro_0 b_f[0] float
// gyro_1 b_f[1] float
// gyro_2 b_f[2] float
export class NavFilterBias extends MAVLinkMessage {
	public usec!: number;
	public accel_0!: number;
	public accel_1!: number;
	public accel_2!: number;
	public gyro_0!: number;
	public gyro_1!: number;
	public gyro_2!: number;
	public _message_id: number = 220;
	public _message_name: string = 'NAV_FILTER_BIAS';
	public _crc_extra: number = 34;
	public _message_fields: [string, string, boolean][] = [
		['usec', 'uint64_t', false],
		['accel_0', 'float', false],
		['accel_1', 'float', false],
		['accel_2', 'float', false],
		['gyro_0', 'float', false],
		['gyro_1', 'float', false],
		['gyro_2', 'float', false],
	];
}