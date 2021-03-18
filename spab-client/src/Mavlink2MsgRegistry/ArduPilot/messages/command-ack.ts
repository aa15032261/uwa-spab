import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
import {MavCmd} from '../enums/mav-cmd';
import {MavResult} from '../enums/mav-result';
/*
Report status of a command. Includes feedback whether the command was executed. The command microservice is documented at https://mavlink.io/en/services/command.html
*/
// command Command ID (of acknowledged command). uint16_t
// result Result of command. uint8_t
export class CommandAck extends MAVLinkMessage {
	public command!: MavCmd;
	public result!: MavResult;
	public _message_id: number = 77;
	public _message_name: string = 'COMMAND_ACK';
	public _crc_extra: number = 143;
	public _message_fields: [string, string, boolean][] = [
		['command', 'uint16_t', false],
		['result', 'uint8_t', false],
	];
}