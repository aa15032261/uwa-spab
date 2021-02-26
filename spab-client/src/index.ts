// import config file
import './Config';

import { CamControl } from "./CamControl";

import { io, Socket } from "socket.io-client";

const MAC_FFMPEG_TEST_CFG = ['avfoundation', '-framerate', '30', '-pix_fmt', 'yuyv422', '-video_size', '640x480', '-i', '0:none'];
const RPI_FFMPEG_BUILTIN_CFG = ['video4linux2', '-input_format', 'mjpeg', '-video_size', '640x480', '-i', '/dev/video0'];

// allow unsafe tls connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


function main() {
    const socket = io(SERVER_URL, {
        path: CLIENT_API_PATH,
        rejectUnauthorized: false,
        autoConnect: true,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: Infinity,
        auth: {
            token: CLIENT_API_TOKEN
        },
    });

    let cameras: {name: string, camControl: CamControl, buf: Buffer}[] = [];

    for (let camCfg of CAM_CFGS) {
        let camera = {
            name: camCfg.name,
            camControl: new CamControl(camCfg.cfg, '5'),
            buf: Buffer.alloc(0)
        }

        camera.camControl.imgCallback = (buf: Buffer) => {
            camera.buf = buf;
        }
        camera.camControl.imgInterval = CAM_ONLINE_INTERVAL;

        cameras.push(camera);
    }


    let isOnline = true;
    let cameraTimer: NodeJS.Timeout | null;

    let cameraLoop = (timeout?: number) => {
        if (cameraTimer) {
            clearTimeout(cameraTimer);
        }


        if (!socket.disconnected) {
            let camData: {name: string, buf: Buffer}[] = [];

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
        } else {
            _timeout = timeout;
        }
        
        cameraTimer = setTimeout(() => {
            cameraLoop();
        } ,_timeout);
    }

    let connectHandler = () => {
        console.log('connect');

        socket.sendBuffer = [];
        cameraLoop(1);

        socket.on('isOnline', function (isOnline: boolean) {
            if (isOnline === true) {
                isOnline = true;
            } else {
                isOnline = false;
            }
        });
    };

    let disconnectHandler = (err: any) => {
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