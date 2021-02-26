"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const tslib_1 = require("tslib");
const childProcess = require("child_process");
class Utils {
    static asyncExec(command, args, maxBuffer) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let _maxBuffer = maxBuffer !== null && maxBuffer !== void 0 ? maxBuffer : 64 * 1024;
            return new Promise((resolve, reject) => {
                let child = childProcess.spawn(command, args, {
                    shell: false
                });
                let out = Buffer.alloc(0);
                let err = Buffer.alloc(0);
                child.stdout.on('data', (chunk) => {
                    if (out.length + chunk.length <= _maxBuffer) {
                        out = Buffer.concat([out, chunk]);
                    }
                    else if (out.length < _maxBuffer) {
                        out = Buffer.concat([out, chunk.slice(0, _maxBuffer - out.length)]);
                    }
                    else {
                        child.kill('SIGABRT');
                    }
                });
                child.stderr.on('data', (chunk) => {
                    if (err.length + chunk.length <= _maxBuffer) {
                        err = Buffer.concat([err, chunk]);
                    }
                    else if (out.length < _maxBuffer) {
                        err = Buffer.concat([err, chunk.slice(0, _maxBuffer - err.length)]);
                    }
                    else {
                        child.kill('SIGABRT');
                    }
                });
                child.on('close', (code) => {
                    resolve({
                        out,
                        err
                    });
                });
            });
        });
    }
}
exports.Utils = Utils;
