import * as express from 'express';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";
import * as mongodb from 'mongodb'

export class RestApi {

    private _db?: mongodb.Db;

    constructor(app: express.Express) {

    }

    public updateDbPool(db: mongodb.Db) {
        this._db = db;
    }
}