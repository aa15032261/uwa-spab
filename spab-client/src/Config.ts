declare global {
    /** Development mode - currently not in used */
    var DEV: boolean;
    /** Local log cache directory path */
    var LOG_DB_PATH: string;

    /** Server url */
    var SERVER_URL: string;
    /** Client WebSocket API path */
    var CLIENT_WSAPI_PATH: string;
    /** Client's API token */
    var CLIENT_API_TOKEN: string;
    /** Client's two-factor login settings */
    var CLIENT_TWO_FACTOR: {type: string, secret: string};

    /** Ardupilot COM port device path */
    var ARDUPILOT_COM_PATH: string;
    /** Ardupilot COM port baud rate */
    var ARDUPILOT_COM_BAUD: number;

    /** 
     * Camera configuration
     * name - camera name
     * cfg - ffmpeg parameters for the camera
     */
    var CAM_CFGS: ReadonlyArray<{name: string, cfg: ReadonlyArray<string>}>;
    /** Camera data interval for polling mode */
    var CAM_ONLINE_INTERVAL: number;
    /** Camera data interval for idle mode */
    var CAM_OFFLINE_INTERVAL: number;

    /** Sensor data interval for polling mode */
    var SNR_ONLINE_INTERVAL: number;
    /** Sensor data interval for idle mode */
    var SNR_OFFLINE_INTERVAL: number;
}

require('../config.js')();

export {
    
}