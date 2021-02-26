declare global {
    var DEV: boolean;
    var LOG_DB_PATH: string;

    var SERVER_URL: string;
    var CLIENT_API_PATH: string;
    var CLIENT_API_TOKEN: string;

    var CAM_CFGS: ReadonlyArray<{name: string, cfg: ReadonlyArray<string>}>;
    var CAM_ONLINE_INTERVAL: number;
    var CAM_OFFLINE_INTERVAL: number;

    var SNR_ONLINE_INTERVAL: number;
    var SNR_OFFLINE_INTERVAL: number;
}

require('../config.js')();

export {
    
}