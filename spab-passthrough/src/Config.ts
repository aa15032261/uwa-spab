declare global {
    var DEV: boolean;
    var LOCAL_PORT: number;

    var SERVER_URL: string;
    var PASSTHROUGH_WSAPI_PATH: string;
    var CLIENT_API_TOKEN: string;
    var CLIENT_TWO_FACTOR: {type: string, secret: string};
}

require('../config.js')();

export {
    
}