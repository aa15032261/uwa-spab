const path = require('path');

module.exports = function() {
    this.DEV = true;
    this.LOG_DB_PATH = path.resolve(__dirname, './log_db');

    this.SERVER_URL = 'wss://therevproject.com';
    this.CLIENT_API_PATH = '/spab_2021s1/api/client_ws/';
    this.CLIENT_API_TOKEN = '6fca079c9acf449ee793b7478936e8d524ebfc0ff964a8c2d5ea4b8597535692';
    this.CLIENT_TWO_FACTOR = {
        type: 'totp',
        secret: 'MYCSAYK7KMCH4KIH'
    };

    this.CAM_CFGS = [
        {
            name: "Test",
            cfg: ['avfoundation', '-framerate', '30', '-pix_fmt', 'bgr0', '-video_size', '640x480', '-i', '0:none']
        },
        /*{
            name: "Front",
            cfg: ['video4linux2', '-input_format', 'bgr0', '-video_size', '640x480', '-i', '/dev/video0']
        }*/
    ];

    this.CAM_ONLINE_INTERVAL = 333;
    this.CAM_OFFLINE_INTERVAL = 1 * 60 * 1000;

    this.SNR_ONLINE_INTERVAL = 100;
    this.SNR_OFFLINE_INTERVAL = 30 * 1000;
}