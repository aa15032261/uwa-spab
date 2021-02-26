declare global {
    var DEV: boolean;
    var PORT: number;

    var CLIENT_API_PATH: string;
    var GUI_API_PATH: string;
}

require('../config.js')();

export {
    
}