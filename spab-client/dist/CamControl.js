"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamControl = void 0;
const childProcess = require("child_process");
class CamControl {
    constructor(f, imgQuality) {
        this._f = [];
        this._imgQuality = '5';
        this._imgCallback = null;
        this._imgInterval = 500;
        this._ffmpegProcess = null;
        this._imgBuf = Buffer.alloc(0);
        this._imgTimer = null;
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
        if (this._ffmpegProcess) {
            if (!this._ffmpegProcess.killed) {
                this._ffmpegProcess.kill('SIGABRT');
                if (this._imgTimer) {
                    clearTimeout(this._imgTimer);
                }
                this._imgTimer = null;
            }
            return;
        }
        this._ffmpegProcess = childProcess.spawn('ffmpeg', [
            '-loglevel', 'quiet',
            '-f', ...this._f,
            '-q:v', this._imgQuality,
            '-vf', 'fps=1000/' + this._imgInterval,
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
        this._ffmpegProcess.on('close', (code) => {
            this._imgBuf = Buffer.alloc(0);
            this._callImgCallbackOnTimeout();
            this._ffmpegProcess = null;
            setTimeout(() => {
                this._restartFFMpeg();
            }, 1000);
        });
    }
    set imgCallback(imgCallback) {
        this._imgCallback = imgCallback;
    }
    set imgInterval(imgInterval) {
        this._imgInterval = imgInterval;
        this._restartFFMpeg();
    }
}
exports.CamControl = CamControl;
CamControl.MAX_BUFFER_SIZE = 64 * 1024;
