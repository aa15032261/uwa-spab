export enum UalbertaAutopilotMode {
	MODE_MANUAL_DIRECT = 1, // Raw input pulse widts sent to output
	MODE_MANUAL_SCALED = 2, // Inputs are normalized using calibration, the converted back to raw pulse widths for output
	MODE_AUTO_PID_ATT = 3, //  dfsdfs
	MODE_AUTO_PID_VEL = 4, //  dfsfds
	MODE_AUTO_PID_POS = 5, //  dfsdfsdfs
	UALBERTA_AUTOPILOT_MODE_ENUM_END = 6, // 
}