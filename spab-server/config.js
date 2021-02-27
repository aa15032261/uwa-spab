module.exports = function() {
    this.DEV = true;
    this.PORT = 8765;

    this.MONGO_URL = '127.0.0.1:27017';
    this.MONGO_USER = 'spab';
    this.MONGO_PASSWORD = 'spab';
    this.MONGO_DB_NAME = 'spab';

    this.CLIENT_API_PATH = '/api/client_ws/';
    this.GUI_API_PATH = '/api/gui_ws/';
}