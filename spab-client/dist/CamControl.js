"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamControl = void 0;
const childProcess = require("child_process");
class CamControl {
    constructor(f, imgQuality) {
        this._f = [];
        this._imgQuality = '5';
        this._imgCallback = null;
        this._imgInterval = -1;
        this._ffmpegProcess = null;
        this._imgBuf = Buffer.alloc(0);
        this._imgTimer = null;
        this._restartTimer = null;
        this._startTimer = null;
        this._f = f;
        this._imgQuality = imgQuality;
    }
    _callImgCallbackOnTimeout() {
        if (this._imgTimer) {
            clearTimeout(this._imgTimer);
        }
        this._imgTimer = setTimeout(() => {
            if (this._imgCallback) {
                this._imgCallback(this._imgBuf);
            }
            this._imgBuf = Buffer.alloc(0);
            this._imgTimer = null;
        }, 20);
    }
    _restartFFMpeg() {
        if (this._startTimer) {
            clearTimeout(this._startTimer);
        }
        if (!this._ffmpegProcess) {
            this._startTimer = setTimeout(() => {
                this._startFFMpeg();
                this._startTimer = null;
            }, 500);
        }
        else {
            if (!this._ffmpegProcess.killed) {
                this._ffmpegProcess.kill('SIGABRT');
                if (this._imgTimer) {
                    clearTimeout(this._imgTimer);
                    this._imgTimer = null;
                }
            }
            if (this._restartTimer) {
                clearTimeout(this._restartTimer);
            }
            this._restartTimer = setTimeout(() => {
                if (this._ffmpegProcess) {
                    this._restartFFMpeg();
                }
                else {
                    this._startTimer = setTimeout(() => {
                        this._startFFMpeg();
                        this._startTimer = null;
                    }, 500);
                }
                this._restartTimer = null;
            }, 500);
        }
    }
    _startFFMpeg() {
        if (!this._ffmpegProcess) {
            let vfOptions;
            if (this._imgInterval > 0) {
                vfOptions = ['-vf', 'fps=1000/' + this._imgInterval];
            }
            else {
                vfOptions = ['-vframes', '1'];
            }
            this._ffmpegProcess = childProcess.spawn('ffmpeg', [
                '-loglevel', 'quiet',
                '-f', ...this._f,
                '-q:v', this._imgQuality,
                ...vfOptions,
                '-f', 'mjpeg', '-'
            ], {
                shell: false
            });
            this._ffmpegProcess.stdout.on('data', (chunk) => {
                if (this._imgBuf.length + chunk.length <= CamControl.MAX_BUFFER_SIZE) {
                    this._imgBuf = Buffer.concat([this._imgBuf, chunk]);
                }
                else if (this._imgBuf.length < CamControl.MAX_BUFFER_SIZE) {
                    this._imgBuf = Buffer.concat([
                        this._imgBuf,
                        chunk.slice(0, CamControl.MAX_BUFFER_SIZE - this._imgBuf.length)
                    ]);
                }
                this._callImgCallbackOnTimeout();
            });
            this._ffmpegProcess.stderr.on('data', (chunk) => {
            });
            this._ffmpegProcess.on('exit', (code) => {
                this._ffmpegProcess = null;
                if (this._imgInterval > 0) {
                    this._restartFFMpeg();
                }
            });
        }
    }
    takePicture() {
        if (this._imgInterval <= 0) {
            this._startFFMpeg();
        }
    }
    set imgCallback(imgCallback) {
        this._imgCallback = imgCallback;
    }
    set imgInterval(imgInterval) {
        if (imgInterval <= 0) {
            if (this._ffmpegProcess && !this._ffmpegProcess.killed) {
                this._ffmpegProcess.kill('SIGABRT');
            }
            this._imgInterval = -1;
        }
        else if (this._imgInterval !== imgInterval) {
            this._imgInterval = imgInterval;
            this._restartFFMpeg();
        }
    }
}
exports.CamControl = CamControl;
CamControl.MAX_BUFFER_SIZE = 64 * 1024;
