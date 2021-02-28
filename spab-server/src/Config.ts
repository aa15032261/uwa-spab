declare global {
    var DEV: boolean;
    var PORT: number;
    var DOMAIN: string;

    var MONGO_URL: string;
    var MONGO_USER: string;
    var MONGO_PASSWORD: string;
    var MONGO_DB_NAME: string;

    var CLIENT_API_PATH: string;
    var GUI_API_PATH: string;

    var USER_PASSWORD_SALT: string;
    var SESSION_NAME: string;
    var SESSION_COOKIE_IV: string;
    var SESSION_COOKIE_KEY: string;
    var SESSION_DATA_IV: string;
    var SESSION_DATA_KEY: string;
    var SESSION_TTL: number;
}

require('../config.js')();

export {
    
}