declare global {
    var DEV: boolean;
    var PORT: number;

    var MONGO_URL: string;
    var MONGO_USER: string;
    var MONGO_PASSWORD: string;
    var MONGO_DB_NAME: string;

    var CLIENT_API_PATH: string;
    var GUI_API_PATH: string;
}

require('../config.js')();

export {
    
}