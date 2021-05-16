import { Database } from 'sqlite3';
import * as fs from 'fs-extra';

import * as path from 'path';
import * as crypto from 'crypto';

import { SpabDataStruct } from "../../spab-data-struct/SpabDataStruct";

export class LogClientDb {
    private _db: Database;
    private _ready = false;

    private _dbCount = 0;

    /**
     * Database error handler
     * 
     * @param {any} err - Error message
     */
    private _dbErrorHandler = (err: any) => {
        if (err) {
            console.log(err);
        }
    };

    /**
     * LogClientDb manages client's local log cache.
     * 
     * @param dbPath - Database directory path
     * @param apiToken - Client's API token
     */
    constructor (dbPath: string, apiToken: string) {
        // Ensures the directory structure exists
        let dbFile = path.resolve(dbPath, './' + apiToken + '.sqlite3');
        fs.ensureFileSync(dbFile);

        // Initialises sqlite database
        this._db = new Database(dbFile);

        this._db.on('open', () => {
            console.log('db ready');

            // Creates database structure
            this._db.run(
                'CREATE TABLE IF NOT EXISTS OfflineCache (logId INTEGER, timestamp INTEGER, type TEXT, typeId TEXT, data BLOB);',
                this._dbErrorHandler
            );

            this._ready = true;

            // Removes deleted data from database permanently
            this.vacuum();
        });
        this._db.on('error', (err: any) => {
            console.log(err);
        });
    }

    /**
     * Generates a log id
     * 
     * @returns {number} - New log id
     */
    private _genLogId(): number {
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

    /**
     * Adds a new log to local database
     * 
     * @param {string} type - Log type
     * @param {string} typeId - Log type id
     * @param {Uint8Array} data - Log data
     */
    public add(type: string, typeId: string, data: Uint8Array) {
        if (!this._ready) {
            return;
        }

        let logId = this._genLogId();
        let timestamp = (new Date()).getTime();

        this._db.run(
            'INSERT INTO OfflineCache (logId, timestamp, type, typeId, data) VALUES (?, ?, ?, ?, ?)',
            [logId, timestamp, type, typeId, data],
            this._dbErrorHandler
        );
    }

    /**
     * Removes a log from local database
     * 
     * @param {number} logId - Log id
     * @param {number} timestamp - Log Timestamp
     * @param {string} type - Log type
     * @param {string} typeId - Log type id
     */
    public remove(logId: number, timestamp: number, type: string, typeId: string) {
        if (!this._ready) {
            return;
        }

        this._db.run(
            'DELETE FROM OfflineCache WHERE logId=? AND timestamp=? AND type=? AND typeId=?',
            [logId, timestamp, type, typeId],
            this._dbErrorHandler
        );
    }

    /**
     * Gets the first log from the database
     * 
     * @returns {Promise<SpabDataStruct.ILogClient | null | undefined>} -
     * The function returns the first log as a LogClient object if the database is not empty.
     * Otherwise, it returns null or undefined.
     */
    public async getFirst(): Promise<SpabDataStruct.ILogClient | null | undefined> {
        if (!this._ready) {
            return;
        }

        return new Promise((resolve, reject) => {
            this._db.get(
                'SELECT logId, timestamp, type, typeId, data from OfflineCache order by timestamp limit 1',
                (err: any, row: any) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(row);
                }
            );
        });
    }

    /**
     * Removes deleted data from database permanently
     */
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