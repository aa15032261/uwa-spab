const path = require('path');

module.exports = function() {
    this.DEV = true;
    this.LOCAL_PORT = 5760;

    this.SERVER_URL = 'wss://therevproject.com';
    this.PASSTHROUGH_WSAPI_PATH = '/spab_2021s1/api/passthrough_ws/';
    this.CLIENT_API_TOKEN = 'af1086837a375fca484293341654f0008ca7736cc48525820f63ae8485e16ff6';
    this.CLIENT_TWO_FACTOR = {
        type: 'totp',
        secret: 'KIJCMGRYEAQWWKRM'
    };
}