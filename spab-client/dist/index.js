"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import config file
require("./Config");
const CamControl_1 = require("./CamControl");
const socket_io_client_1 = require("socket.io-client");
const MAC_FFMPEG_TEST_CFG = ['avfoundation', '-framerate', '30', '-pix_fmt', 'yuyv422', '-video_size', '640x480', '-i', '0:none'];
const RPI_FFMPEG_BUILTIN_CFG = ['video4linux2', '-input_format', 'mjpeg', '-video_size', '640x480', '-i', '/dev/video0'];
// allow unsafe tls connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
function main() {
    const socket = socket_io_client_1.io(SERVER_URL, {
        path: CLIENT_API_PATH,
        rejectUnauthorized: false,
        autoConnect: true,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: Infinity,
        auth: {
            token: CLIENT_API_TOKEN
        },
    });
    let cameras = [];
    for (let camCfg of CAM_CFGS) {
        let camera = {
            name: camCfg.name,
            camControl: new CamControl_1.CamControl(camCfg.cfg, '5'),
            buf: Buffer.alloc(0)
        };
        camera.camControl.imgCallback = (buf) => {
            camera.buf = buf;
        };
        camera.camControl.imgInterval = CAM_ONLINE_INTERVAL;
        cameras.push(camera);
    }
    let isOnline = true;
    let cameraTimer;
    let cameraLoop = (timeout) => {
        if (cameraTimer) {
            clearTimeout(cameraTimer);
        }
        if (!socket.disconnected) {
            let camData = [];
            for (let camera of cameras) {
                if (camera.buf.length > 0) {
                    camData.push({
                        name: camera.name,
                        buf: camera.buf
                    });
                }
            }
            socket.emit('camData', camData);
        }
        let _timeout = CAM_OFFLINE_INTERVAL;
        if (timeout === undefined) {
            if (isOnline) {
                _timeout = CAM_ONLINE_INTERVAL;
            }
        }
        else {
            _timeout = timeout;
        }
        cameraTimer = setTimeout(() => {
            cameraLoop();
        }, _timeout);
    };
    let connectHandler = () => {
        console.log('connect');
        socket.sendBuffer = [];
        cameraLoop(1);
        socket.on('isOnline', function (isOnline) {
            if (isOnline === true) {
                isOnline = true;
            }
            else {
                isOnline = false;
            }
        });
    };
    let disconnectHandler = (err) => {
        isOnline = false;
        if (cameraTimer) {
            clearTimeout(cameraTimer);
        }
        cameraTimer = null;
        console.log(err);
    };
    socket.on('connect', connectHandler);
    socket.on('reconnect', connectHandler);
    socket.on('connect_error', disconnectHandler);
}
main();
