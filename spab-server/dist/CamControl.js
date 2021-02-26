"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamControl = void 0;
const tslib_1 = require("tslib");
const Utils_1 = require("./Utils");
class CamControl {
    static getJpgBufFromCamera(f, jpgQuality) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let ret = yield Utils_1.Utils.asyncExec('ffmpeg', [
                    '-loglevel', 'quiet',
                    '-f', ...f,
                    '-q:v', jpgQuality,
                    '-vframes', '1',
                    '-f', 'mjpeg', '-'
                ]);
                if (ret.err.length > 0) {
                    throw ret.err.toString('utf8');
                }
                if (ret.out.length > 0) {
                    return ret.out;
                }
            }
            catch (e) {
                console.log(e);
            }
            return undefined;
        });
    }
}
exports.CamControl = CamControl;
