const path = require('path');

module.exports = function() {
    this.DEV = true;
    this.LOG_DB_PATH = path.resolve(__dirname, './log_db');

    this.SERVER_URL = 'wss://spab.toms.directory';
    this.CLIENT_API_PATH = '/api/client_ws/';
    this.CLIENT_API_TOKEN = 'c3854a4bf55287c0ac9183549a31e88977a2f4879b7959cf231de5b6af8f8d8a';
    this.CLIENT_TWO_FACTOR = {
        type: 'totp',
        secret: 'WZBTLIWDJRSXIS3Q'
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

    this.CAM_ONLINE_INTERVAL = 500;
    this.CAM_OFFLINE_INTERVAL = 1 * 60 * 1000;

    this.SNR_ONLINE_INTERVAL = 100;
    this.SNR_OFFLINE_INTERVAL = 30 * 1000;
}