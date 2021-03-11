declare global {
    var DEV: boolean;
    var PORT: number;
    var DOMAIN: string;
    var BASE_URL: string;

    var DB_HOST: string;
    var DB_PORT: number;
    var DB_NAME: string;
    var DB_USER: string;
    var DB_PASSWORD: string;

    var CLIENT_WSAPI_PATH: string;
    var GUI_WSAPI_PATH: string;

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