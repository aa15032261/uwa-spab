declare global {
    /** Development mode - currently not in used */
    var DEV: boolean;

    /** App port */
    var PORT: number;
    /** App domain name */
    var DOMAIN: string;
    /** App base url */
    var BASE_URL: string;

    /** Postgres database host */
    var DB_HOST: string;
    /** Postgres database port */
    var DB_PORT: number;
    /** App database name */
    var DB_NAME: string;
    /** App database login username */
    var DB_USER: string;
    /** App database login password */
    var DB_PASSWORD: string;

    /** Passthrough WebSocket API path */
    var PASSTHROUGH_WSAPI_PATH: string;
    /** Client WebSocket API path */
    var CLIENT_WSAPI_PATH: string;
    /** GUI WebSocket API path */
    var GUI_WSAPI_PATH: string;

    /** Salt for encrypting user password */
    var USER_PASSWORD_SALT: string;

    /** App session name */
    var SESSION_NAME: string;

    /** App session cookie token encryption keys */
    var SESSION_COOKIE_IV: string;
    var SESSION_COOKIE_KEY: string;

    /** App session data encryption keys */
    var SESSION_DATA_IV: string;
    var SESSION_DATA_KEY: string;

    /** App session time to live timeout */
    var SESSION_TTL: number;
}

require('../config.js')();

export {
    
}