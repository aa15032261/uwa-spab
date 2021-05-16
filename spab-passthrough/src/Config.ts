declare global {
    /** Development mode - currently not in used */
    var DEV: boolean;

    /** Local tcp port */
    var LOCAL_PORT: number;

    /** Server url */
    var SERVER_URL: string;
    /** Passthrough WebSocket API path */
    var PASSTHROUGH_WSAPI_PATH: string;
    /** Client's API token */
    var CLIENT_API_TOKEN: string;
    /** Client's two-factor login settings */
    var CLIENT_TWO_FACTOR: {type: string, secret: string};
}

require('../config.js')();

export {
    
}