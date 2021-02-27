module.exports = function() {
    this.DEV = true;
    this.PORT = 8765;
    this.DOMAIN = 'spab.toms.directory'

    this.MONGO_URL = '127.0.0.1:27017';
    this.MONGO_USER = 'spab';
    this.MONGO_PASSWORD = 'spab';
    this.MONGO_DB_NAME = 'spab';

    this.CLIENT_API_PATH = '/api/client_ws/';
    this.GUI_API_PATH = '/api/gui_ws/';


    this.USER_PASSWORD_SALT = 'oq723uh4k234#Q#23&(*Ynh/';
    this.SESSION_NAME = 'spab_session';
    this.SESSION_ID_SECRET = 'a773r5O*)27P(&#@HR#65aew76r';
    this.SESSION_DATA_SECRET = '0(&#YHJHR)#g8iq4y4r23423@#4$t734t';
    this.SESSION_TTL = 2 * 60 * 60;
}