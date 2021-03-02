import { Database } from 'sqlite3';
import * as fs from 'fs-extra';

import * as path from 'path';
import * as crypto from 'crypto';

import { SpabDataStruct } from "../../spab-data-struct/SpabDataStruct";

export class LogClientDb {
    private _db: Database;
    private _ready = false;

    private _dbCount = 0;

    private _dbErrorHandler = (err: any) => {
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
                'CREATE TABLE IF NOT EXISTS OfflineCache (id INTEGER, timestamp INTEGER, type TEXT, data BLOB);',
                this._dbErrorHandler
            );

            this._ready = true;

            this.vacuum();
        });
        this._db.on('error', (err: any) => {
            console.log(err);
        });
    }

    private _4bytesRand(): number {
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

    public add(type: string, data: Uint8Array) {
        if (!this._ready) {
            return;
        }

        let id = this._4bytesRand();
        let timestamp = (new Date()).getTime();

        this._db.run(
            'INSERT INTO OfflineCache VALUES (?, ?, ?, ?)',
            [id, timestamp, type, data],
            this._dbErrorHandler
        );
    }

    public remove(id: number, timestamp: number, type: string) {
        if (!this._ready) {
            return;
        }

        this._db.run(
            'DELETE FROM OfflineCache WHERE id=? AND timestamp=? AND type=?',
            [id, timestamp, type],
            this._dbErrorHandler
        );
    }

    public async getFirst(): Promise<SpabDataStruct.ILogClient | null | undefined> {
        if (!this._ready) {
            return;
        }

        return new Promise((resolve, reject) => {
            this._db.get(
                'SELECT id, timestamp, type, data from OfflineCache order by timestamp limit 1',
                (err: any, row: any) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(row);
                }
            );
        });
    }

    public vacuum() {
        if (!this._ready) {
            return;
        }

        this._db.run(
            'VACUUM',
            this._dbErrorHandler
        )
    }
}