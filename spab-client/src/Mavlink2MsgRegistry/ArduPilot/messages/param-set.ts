import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
import {MavParamType} from '../enums/mav-param-type';
/*
Set a parameter value (write new value to permanent storage). IMPORTANT: The receiving component should acknowledge the new parameter value by sending a PARAM_VALUE message to all communication partners. This will also ensure that multiple GCS all have an up-to-date list of all parameters. If the sending GCS did not receive a PARAM_VALUE message within its timeout time, it should re-send the PARAM_SET message. The parameter microservice is documented at https://mavlink.io/en/services/parameter.html
*/
// target_system System ID uint8_t
// target_component Component ID uint8_t
// param_id Onboard parameter id, terminated by NULL if the length is less than 16 human-readable chars and WITHOUT null termination (NULL) byte if the length is exactly 16 chars - applications have to provide 16+1 bytes storage if the ID is stored as string char
// param_value Onboard parameter value float
// param_type Onboard parameter type. uint8_t
export class ParamSet extends MAVLinkMessage {
	public target_system!: number;
	public target_component!: number;
	public param_id!: string;
	public param_value!: number;
	public param_type!: MavParamType;
	public _message_id: number = 23;
	public _message_name: string = 'PARAM_SET';
	public _crc_extra: number = 168;
	public _message_fields: [string, string, boolean][] = [
		['param_value', 'float', false],
		['target_system', 'uint8_t', false],
		['target_component', 'uint8_t', false],
		['param_id', 'char', false],
		['param_type', 'uint8_t', false],
	];
}