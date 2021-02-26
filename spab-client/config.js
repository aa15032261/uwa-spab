module.exports = function() {
    this.DEV = true;

    this.SERVER_URL = 'wss://spab.toms.directory';
    this.CLIENT_API_PATH = '/api/client_ws/';
    this.CLIENT_API_TOKEN = 'TEST_TOKEN';

    this.CAM_CFGS = [
        {
            name: "Test",
            cfg: ['avfoundation', '-framerate', '30', '-pix_fmt', 'yuyv422', '-video_size', '640x480', '-i', '0:none']
        },
        /*{
            name: "Front",
            cfg: ['video4linux2', '-input_format', 'mjpeg', '-video_size', '640x480', '-i', '/dev/video0']
        }*/
    ];

    this.CAM_ONLINE_INTERVAL = 500;
    this.CAM_OFFLINE_INTERVAL = 5 * 60 * 1000;
}