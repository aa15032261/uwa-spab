import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
/*
The IMU readings in SI units in NED body frame
*/
// time_usec Timestamp (UNIX Epoch time or time since system boot). The receiving end can infer timestamp format (since 1.1.1970 or since system boot) by checking for the magnitude of the number. uint64_t
// xacc X acceleration float
// yacc Y acceleration float
// zacc Z acceleration float
// xgyro Angular speed around X axis in body frame float
// ygyro Angular speed around Y axis in body frame float
// zgyro Angular speed around Z axis in body frame float
// xmag X Magnetic field float
// ymag Y Magnetic field float
// zmag Z Magnetic field float
// abs_pressure Absolute pressure float
// diff_pressure Differential pressure (airspeed) float
// pressure_alt Altitude calculated from pressure float
// temperature Temperature float
// fields_updated Bitmap for fields that have updated since last message, bit 0 = xacc, bit 12: temperature, bit 31: full reset of attitude/position/velocities/etc was performed in sim. uint32_t
export class HilSensor extends MAVLinkMessage {
	public time_usec!: number;
	public xacc!: number;
	public yacc!: number;
	public zacc!: number;
	public xgyro!: number;
	public ygyro!: number;
	public zgyro!: number;
	public xmag!: number;
	public ymag!: number;
	public zmag!: number;
	public abs_pressure!: number;
	public diff_pressure!: number;
	public pressure_alt!: number;
	public temperature!: number;
	public fields_updated!: number;
	public _message_id: number = 107;
	public _message_name: string = 'HIL_SENSOR';
	public _crc_extra: number = 108;
	public _message_fields: [string, string, boolean][] = [
		['time_usec', 'uint64_t', false],
		['xacc', 'float', false],
		['yacc', 'float', false],
		['zacc', 'float', false],
		['xgyro', 'float', false],
		['ygyro', 'float', false],
		['zgyro', 'float', false],
		['xmag', 'float', false],
		['ymag', 'float', false],
		['zmag', 'float', false],
		['abs_pressure', 'float', false],
		['diff_pressure', 'float', false],
		['pressure_alt', 'float', false],
		['temperature', 'float', false],
		['fields_updated', 'uint32_t', false],
	];
}