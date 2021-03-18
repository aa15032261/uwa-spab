export enum WinchActions {
	WINCH_RELAXED = 0, // Relax winch.
	WINCH_RELATIVE_LENGTH_CONTROL = 1, // Winch unwinds or winds specified length of cable optionally using specified rate.
	WINCH_RATE_CONTROL = 2, // Winch unwinds or winds cable at specified rate in meters/seconds.
	WINCH_ACTIONS_ENUM_END = 3, // 
}