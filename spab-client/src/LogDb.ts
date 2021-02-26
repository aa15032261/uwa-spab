import { Database } from 'sqlite3';
import * as fs from 'fs-extra';

import * as path from 'path';
import * as crypto from 'crypto';

import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";

export class LogDb {
    private _db: Database;
    private _ready = false;

    private _dbCount = 0;

    private _dbErrorHandler = (res: any, err: any) => {
        if (err) {
            console.log(err);
        }
    };

    constructor (dbPath: string, apiToken: string) {
        let dbFile = path.resolve(dbPath, './' + apiToken + '.sqlite3');

        fs.ensureFileSync(dbFile);

        this._db = new Database(dbFile);

        this._db.on('open', () => {
            console.log('db ready');

            // initialise db structure
            this._db.run(
                'CREATE TABLE IF NOT EXISTS OfflineCache (id TEXT PRIMARY KEY, timestamp INTEGER, type TEXT, data BLOB);',
                this._dbErrorHandler
            );
            this._ready = true;
        });
        this._db.on('error', (err: any) => {
            console.log(err);
        });
    }

    private _4bytesRand(): string {
        let randBytes = crypto.randomBytes(3);

        this._dbCount++;
        if (this._dbCount > 255) {
            this._dbCount = 0;
        }

        let randNum = randBytes[0];
        randNum |= randBytes[1] << 8;
        randNum |= randBytes[2] << 16;
        randNum |= this._dbCount << 24;

        return randNum.toString(36);
    }

    public add(type: 'camera' | 'sensor', obj: any) {
        if (!this._ready) {
            return;
        }

        let timestamp = (new Date()).getTime();

        let id = timestamp.toString(36) + '-' + type + '-' + this._4bytesRand();

        let data = Buffer.alloc(0);

        if (type === 'camera') {
            data = Buffer.from(SpabDataStruct.CameraData.encode(obj).finish());
        } else if (type === 'sensor') {
            data = Buffer.from(SpabDataStruct.SensorData.encode(obj).finish());
        }

        this._db.run(
            'INSERT INTO OfflineCache VALUES (?, ?, ?, ?)',
            [id, timestamp, type, data],
            this._dbErrorHandler
        );
    }

    public remove(logId: string) {
        
    }

    public getFirst(type?: string) {
        
    }
}