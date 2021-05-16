import * as childProcess from 'child_process';

export class CamControl {

    private static MAX_BUFFER_SIZE = 64 * 1024;

    private _cfg: ReadonlyArray<string> = [];
    private _imgCallback: ((buf: Buffer) => void) | undefined;


    private _imgInterval = -1;
    private _ffmpegProcess: childProcess.ChildProcessWithoutNullStreams | undefined;

    private _imgBuf = Buffer.alloc(0);
    private _imgTimer: NodeJS.Timeout | undefined;

    private _restartTimer: NodeJS.Timeout | undefined;
    private _startTimer: NodeJS.Timeout | undefined;


    /**
     * CamControl manages camera streams via ffmpeg
     * 
     * @param {Array<string>} cfg - Camera's ffmpeg flags 
     */
    constructor (cfg: ReadonlyArray<string>) {
        this._cfg = cfg;
    }

    /**
     * Image stream callback
     */
    set imgCallback(imgCallback: (buf: Buffer) => void) {
        this._imgCallback = imgCallback;
    }

    /**
     * Image stream interval
     * 
     * When imgInterval is set to a positive number, 
     * CamControl creates a ffmpeg background process to 
     * feed camera stream to the image stream callback function. 
     */
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

    /**
     * Calls imgCallback after a small timeout. This function is used to 
     * ensure the entire image buffer is received before calling imgCallback.
     */
    private _callImgCallbackOnTimeout() {
        if (this._imgTimer) {
            clearTimeout(this._imgTimer);
        }

        this._imgTimer = setTimeout(async () => {
            if (this._imgCallback) {
                this._imgCallback(this._imgBuf);
            }
            this._imgBuf = Buffer.alloc(0);
            this._imgTimer = undefined;
        }, 25);
    }

    /**
     * Restarts the ffmpeg process.
     */
    private _restartFFMpeg() {
        // Clears ffmpeg start timer
        if (this._startTimer) {
            clearTimeout(this._startTimer);
        }

        if (!this._ffmpegProcess) {
            // If ffmpeg is not running, starts the process immediately
            this._startTimer = setTimeout(() => {
                this._startFFMpeg();
                this._startTimer = undefined;
            }, 200);
        } else {
            // If ffmpeg is running, kills the process immediately
            if (!this._ffmpegProcess.killed) {
                this._ffmpegProcess.kill('SIGABRT');

                if (this._imgTimer) {
                    clearTimeout(this._imgTimer);
                    this._imgTimer = undefined;
                }
            }

            // Creates a ffmpeg restart timer to restart the process
            if (this._restartTimer) {
                clearTimeout(this._restartTimer);
            }
            this._restartTimer = setTimeout(() => {
                this._restartFFMpeg();
                this._restartTimer = undefined;
            }, 200);
        }
    }


    /**
     * Starts the ffmpeg process.
     */
    private _startFFMpeg() {
        if (!this._ffmpegProcess) {

            let vfOptions: string[];

            if (this._imgInterval > 0) {
                // Gets frames at interval specified by _imgInterval
                vfOptions = ['-r', (1000 / this._imgInterval).toFixed(2)];
            } else {
                // Gets one frame
                vfOptions = ['-vframes', '1'];
            }

            // Creates a ffmpeg process
            this._ffmpegProcess = childProcess.spawn(
                'ffmpeg',
                [
                    '-loglevel', 'quiet',   // Hides all console messages

                    '-f', ...this._cfg,     // Camera parameters

                    ...vfOptions,           // Frame per second option

                    '-q:v', '12',           // Image quality with value from 1-31, 
                                            // where 1 is the best and 31 is the worst

                    '-f', 'mjpeg', '-'      // Output each frame as jpeg to stdout
                ],
                {
                    shell: false
                }
            );
    
            // Appends ffmpeg output to _imgBuf
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

            // Monitors the process, restarts on crashes.
            this._ffmpegProcess.on('exit', (code: number) => {
                this._ffmpegProcess = undefined;

                if (this._imgInterval > 0) {
                    this._restartFFMpeg();
                }
            });
        }
    }

    /**
     * Gets a single frame from the camera
     */
    public takePicture() {
        if (this._imgInterval <= 0) {
            this._startFFMpeg();
        }
    }
}