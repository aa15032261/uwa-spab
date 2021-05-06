const path = require('path');

module.exports = function() {
    this.DEV = true;
    this.LOG_DB_PATH = path.resolve(__dirname, './log_db');

    this.SERVER_URL = 'wss://therevproject.com';
    this.CLIENT_API_PATH = '/spab_2021s1/api/client_ws/';
    this.CLIENT_API_TOKEN = 'af1086837a375fca484293341654f0008ca7736cc48525820f63ae8485e16ff6';
    this.CLIENT_TWO_FACTOR = {
        type: 'totp',
        secret: 'KIJCMGRYEAQWWKRM'
    };

    this.CAM_CFGS = [
        {
            name: "Test",
            cfg: ['avfoundation', '-framerate', '30', '-pix_fmt', 'bgr0', '-video_size', '640x480', '-i', '0:none']
        }
        /*{
            name: "Front",
            cfg: ['video4linux2', '-input_format', 'bgr0', '-video_size', '640x480', '-i', '/dev/video0']
        }*/
    ];

    //this.ARDUPILOT_COM_PATH = '/dev/ttyACM0';
    //this.ARDUPILOT_COM_PATH = '/dev/tty';
    this.ARDUPILOT_COM_PATH = '/dev/tty.usbserial-A10597BA';
    this.ARDUPILOT_COM_BAUD = 57600;

    this.CAM_ONLINE_INTERVAL = 1000;
    this.CAM_OFFLINE_INTERVAL = 1 * 60 * 1000;

    this.SNR_ONLINE_INTERVAL = 500;
    this.SNR_OFFLINE_INTERVAL = 1 * 30 * 1000;
}