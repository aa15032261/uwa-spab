import * as childProcess from 'child_process';
import * as stream from 'stream';
//import * as mozjpeg from 'mozjpeg';

export class CamControl {

    private static MAX_BUFFER_SIZE = 64 * 1024;

    private _f: ReadonlyArray<string> = [];
    private _imgCallback: ((buf: Buffer) => void) | undefined;


    private _imgInterval = -1;
    private _ffmpegProcess: childProcess.ChildProcessWithoutNullStreams | undefined;

    private _imgBuf = Buffer.alloc(0);
    private _imgTimer: NodeJS.Timeout | undefined;

    private _restartTimer: NodeJS.Timeout | undefined;
    private _startTimer: NodeJS.Timeout | undefined;

    private _callImgCallbackOnTimeout() {
        if (this._imgTimer) {
            clearTimeout(this._imgTimer);
        }

        this._imgTimer = setTimeout(async () => {
            if (this._imgCallback) {
                this._imgCallback(this._imgBuf);
                // let mozJpegProcess = childProcess.spawnSync(
                //     mozjpeg,
                //     ['-quality', '55'],
                //     {
                //         shell: false,
                //         input: this._imgBuf
                //     }
                // );
                // this._imgCallback(mozJpegProcess.stdout);
            }
            this._imgBuf = Buffer.alloc(0);
            this._imgTimer = undefined;
        }, 33);
    }

    private _restartFFMpeg() {
        if (this._startTimer) {
            clearTimeout(this._startTimer);
        }

        if (!this._ffmpegProcess) {
            this._startTimer = setTimeout(() => {
                this._startFFMpeg();
                this._startTimer = undefined;
            }, 500);
        } else {
            if (!this._ffmpegProcess.killed) {
                this._ffmpegProcess.kill('SIGABRT');

                if (this._imgTimer) {
                    clearTimeout(this._imgTimer);
                    this._imgTimer = undefined;
                }
            }

            if (this._restartTimer) {
                clearTimeout(this._restartTimer);
            }

            this._restartTimer = setTimeout(() => {
                if (this._ffmpegProcess) {
                    this._restartFFMpeg();
                } else {
                    this._startTimer = setTimeout(() => {
                        this._startFFMpeg();
                        this._startTimer = undefined;
                    }, 500);
                }
                this._restartTimer = undefined;
            }, 500);
        }
    }

    private _startFFMpeg() {
        if (!this._ffmpegProcess) {

            let vfOptions: string[];

            if (this._imgInterval > 0) {
                vfOptions = ['-r', (1000 / this._imgInterval).toFixed(2)];
            } else {
                vfOptions = ['-vframes', '1'];
            }

            this._ffmpegProcess = childProcess.spawn(
                'ffmpeg',
                [
                    '-loglevel', 'quiet',
                    '-f', ...this._f,
                    ...vfOptions,
                    '-q:v', '12',
                    '-f', 'mjpeg', '-'
                ],
                {
                    shell: false
                }
            );
    
            this._ffmpegProcess.stdout.on('data', (chunk: Buffer) => {
                if (this._imgBuf.length + chunk.length <= CamControl.MAX_BUFFER_SIZE) {
                    this._imgBuf = Buffer.concat([this._imgBuf, chunk]);
                } else if (this._imgBuf.length < CamControl.MAX_BUFFER_SIZE) {
                    this._imgBuf = Buffer.concat([
                        this._imgBuf, 
                        chunk.slice(0, CamControl.MAX_BUFFER_SIZE - this._imgBuf.length)
                    ]);
                }
    
                this._callImgCallbackOnTimeout();
            });

            this._ffmpegProcess.on('exit', (code: number) => {
                this._ffmpegProcess = undefined;

                if (this._imgInterval > 0) {
                    this._restartFFMpeg();
                }
            });
        }
    }

    public takePicture() {
        if (this._imgInterval <= 0) {
            this._startFFMpeg();
        }
    }

    constructor (f: ReadonlyArray<string>) {
        this._f = f;
    }

    set imgCallback(imgCallback: (buf: Buffer) => void) {
        this._imgCallback = imgCallback;
    }

    set imgInterval(imgInterval: number) {
        if (imgInterval <= 0 ) {
            if (this._ffmpegProcess && !this._ffmpegProcess.killed) {
                this._ffmpegProcess.kill('SIGABRT');
            }
            this._imgInterval = -1;
        } else if (this._imgInterval !== imgInterval) {
            this._imgInterval = imgInterval;
            this._restartFFMpeg();
        }
    }
}