module.exports = function() {
    this.DEV = true;
    this.PORT = 8765;
    this.DOMAIN = 'therevproject.com';
    this.BASE_URL = '/spab_2021s1';

    this.DB_HOST = '127.0.0.1';
    this.DB_PORT = 5432;
    this.DB_NAME = 'therevpr_spab_2021s1';
    this.DB_USER = 'therevpr_spab';
    this.DB_PASSWORD = 'therevpr_spab';

    this.PASSTHROUGH_WSAPI_PATH = this.BASE_URL + '/api/passthrough_ws/';
    this.CLIENT_WSAPI_PATH = this.BASE_URL + '/api/client_ws/';
    this.GUI_WSAPI_PATH = this.BASE_URL + '/api/gui_ws/';


    this.USER_PASSWORD_SALT = 'oq723uh4k234#Q#23&(*Ynh/';
    this.SESSION_NAME = 'spab_session';
    this.SESSION_COOKIE_IV = 'a773r5O*d)27P(&#@HR#65aew76r';
    this.SESSION_COOKIE_KEY = '0(&#YHdJHR)#g8iq4y4r23423@#4$t734t';
    this.SESSION_DATA_IV = ')*W#HILEKR{08whnm,sdfw3';
    this.SESSION_DATA_KEY = 'P&(#WUmJKDdFLEWP*(FH;;fpjoSOoijwF';
    this.SESSION_TTL = 2 * 60 * 60;
}