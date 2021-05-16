"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogClientDb = void 0;
const tslib_1 = require("tslib");
const sqlite3_1 = require("sqlite3");
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");
class LogClientDb {
    constructor(dbPath, apiToken) {
        this._ready = false;
        this._dbCount = 0;
        this._dbErrorHandler = (err) => {
            if (err) {
                console.log(err);
            }
        };
        let dbFile = path.resolve(dbPath, './' + apiToken + '.sqlite3');
        fs.ensureFileSync(dbFile);
        this._db = new sqlite3_1.Database(dbFile);
        this._db.on('open', () => {
            console.log('db ready');
            // initialise db structure
            this._db.run('CREATE TABLE IF NOT EXISTS OfflineCache (logId INTEGER, timestamp INTEGER, type TEXT, typeId TEXT, data BLOB);', this._dbErrorHandler);
            this._ready = true;
            this.vacuum();
        });
        this._db.on('error', (err) => {
            console.log(err);
        });
    }
    _4bytesRand() {
        let randBytes = crypto.randomBytes(3);
        this._dbCount++;
        if (this._dbCount > 255) {
            this._dbCount = 0;
        }
        let randNum = randBytes[0];
        randNum |= randBytes[1] << 8;
        randNum |= randBytes[2] << 16;
        randNum |= this._dbCount << 24;
        return randNum;
    }
    add(type, typeId, data) {
        if (!this._ready) {
            return;
        }
        let logId = this._4bytesRand();
        let timestamp = (new Date()).getTime();
        this._db.run('INSERT INTO OfflineCache (logId, timestamp, type, typeId, data) VALUES (?, ?, ?, ?, ?)', [logId, timestamp, type, typeId, data], this._dbErrorHandler);
    }
    remove(logId, timestamp, type, typeId) {
        if (!this._ready) {
            return;
        }
        this._db.run('DELETE FROM OfflineCache WHERE logId=? AND timestamp=? AND type=? AND typeId=?', [logId, timestamp, type, typeId], this._dbErrorHandler);
    }
    getFirst() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._ready) {
                return;
            }
            return new Promise((resolve, reject) => {
                this._db.get('SELECT logId, timestamp, type, typeId, data from OfflineCache order by timestamp limit 1', (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(row);
                });
            });
        });
    }
    vacuum() {
        if (!this._ready) {
            return;
        }
        this._db.run('VACUUM', this._dbErrorHandler);
    }
}
exports.LogClientDb = LogClientDb;
