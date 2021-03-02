import * as mongodb from 'mongodb';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";


interface DbLog extends SpabDataStruct.ILogClient {
    clientId?: mongodb.ObjectId, 
    obj?: any
}

interface SpabLog  {
    type: 'camera' | 'sensor',
    timestamp: number,
    obj: any
}

interface SpabClient {
    clientId: string,
    name: string,
    socketIds: Set<string>,
    latestLogs: SpabLog[]
}

interface SpabClientSummary {
    clientId: string, 
    name: string, 
    connected: boolean
}

class ClientStore {

    private _db?: mongodb.Db;
    private _clientStore = new Map<string, SpabClient>();

    constructor() { }

    public updateDbPool(db: mongodb.Db) {
        this._db = db;
        this._updateClientList();
    }

    private async _updateClientList() {
        try {
            let newClientIdSet = new Set<string>();
            let existingClientIdSet = new Set<string>();

            let clientObjs = await this._db!.collection('client').find({

            }, {
                projection: {
                    _id: 1,
                    name: 1
                }
            }).toArray();

            for (let clientObj of clientObjs) {
                clientObj.clientId = clientObj._id.toString();
                newClientIdSet.add(clientObj._id.toString());
            }

            // remove deleted clients from the list
            for (let [clientId, client] of this._clientStore) {
                if (newClientIdSet.has(client.clientId)) {
                    existingClientIdSet.add(clientId);
                } else {
                    this._clientStore.delete(clientId);
                }
            }

            // add new clients to the list
            for (let clientObj of clientObjs) {
                if (!existingClientIdSet.has(clientObj.clientId)) {
                    await this.createClient(clientObj.clientId, clientObj.name);
                }
            }
        } catch (e) { }
    }

    public async createClient(
        clientId: string,
        name: string
    ) {
        if (!this._clientStore.has(clientId)) {
            let client: SpabClient = {
                clientId: clientId,
                name: name,
                socketIds: new Set<string>(),
                latestLogs: []
            };

            let clientOid = new mongodb.ObjectId(clientId);

            let latestSensorLogs = await this._db!.collection('log').find({
                clientId: clientOid,
                type: 'sensor'
            }, {
                projection: {
                    _id: 0,
                    timestamp: 1
                }
            })
            .sort({'timestamp': -1})
            .limit(1)
            .toArray();

            for (let log of latestSensorLogs) {
                client.latestLogs.push({
                    timestamp: log.timestamp,
                    type: log.type,
                    obj: log.obj
                });
            }


            let latestCameraLogs = await this._db!.collection('log').aggregate([
                {
                    "$match": {
                        clientId: clientOid,
                        type: 'camera'
                    }
                },
                {
                    "$sort": {
                        timestamp: 1
                    }
                },
                {
                    "$group": {
                        _id: "$obj.name",
                        doc: {$first:"$$ROOT"}
                    }
                }
            ]).toArray();

            for (let log of latestCameraLogs) {
                log.doc.obj.buf = log.doc.obj.buf?.buffer;

                client.latestLogs.push({
                    timestamp: log.doc.timestamp,
                    type: log.doc.type,
                    obj: log.doc.obj
                });
            }

            this._clientStore.set(clientId, client);
        }
    }

    public addClientSocketId(clientId: string, socketId: string): boolean {
        let client = this._clientStore.get(clientId);
        if (client) {
            client.socketIds.add(socketId);
            return true;
        }

        return false;
    }

    public removeClientSocketId(clientId: string, socketId: string): boolean {
        let client = this._clientStore.get(clientId);
        if (client) {
            client.socketIds.delete(socketId);
            return true;
        }

        return false;
    }

    public getClientList(): SpabClientSummary[] {
        let clientList: SpabClientSummary[] = [];

        for (let [clientId, client] of this._clientStore) {
            clientList.push({
                clientId: clientId,
                name: client.name,
                connected: client.socketIds.size > 0
            })
        }

        return clientList;
    }

    public isClientExist(clientId: string): boolean {
        if (this._clientStore.has(clientId)) {
            return true;
        }

        return false;
    }

    public getSocketIdCount(clientId: string): number {
        return this._clientStore.get(clientId)?.socketIds.size || 0;
    }

    public getClient(clientId: string): SpabClient | undefined {
        return this._clientStore.get(clientId);
    }

    public async addLogEncoded(
        clientId: string,
        logClientEncoded: any
    ): Promise<SpabLog | undefined> {

        let logClient: SpabDataStruct.ILogClient | undefined;
        let clientOid: mongodb.ObjectId | undefined;

        try {
            logClient = SpabDataStruct.LogClient.decode(new Uint8Array(logClientEncoded));
            clientOid = new mongodb.ObjectId(clientId);

            let client = await this._db!.collection('client').findOne({
                _id: clientOid
            }, {
                projection: {
                    _id: 1
                }
            });

            if (!client) {
                return;
            }

            if (!logClient || !clientOid) {
                return;
            }

            if (logClient.id) {
                // cached data

                // invalid timestamp
                if (logClient.timestamp! > (new Date()).getTime()) {
                    return;
                }

                // check if the cached log is in the database
                let existingLog = await this._db!.collection('log').findOne({
                    id: logClient.id,
                    timestamp: logClient.timestamp,
                    type: logClient.type
                }, {
                    projection: {
                        _id: 1,
                        two_factor: 1
                    }
                });

                if (existingLog) {
                    return;
                }
            } else {
                // real time data
                logClient.timestamp = (new Date()).getTime();
                delete logClient.id;
            }


            let dbLog: DbLog = logClient;
            dbLog.clientId = clientOid;

            let lastLogDataFilter: any = {
                clientId: dbLog.clientId,
                type: logClient.type
            };
            let logFreq = 60 * 1000;

            if (logClient.type === 'camera') {
                dbLog.obj = SpabDataStruct.CameraData.decode(dbLog.data!);
                dbLog.obj.buf = Buffer.from(dbLog.obj.buf);
                lastLogDataFilter["obj.name"] = dbLog.obj.name;
                logFreq = 60 * 1000;
            } else if (logClient.type === 'sensor') {
                dbLog.obj = SpabDataStruct.SensorData.decode(dbLog.data!);
                logFreq = 30 * 1000;
            }

            delete dbLog.data;

            // forcefully remove deleted properties
            dbLog = {...dbLog};

            let lastLogTimestamp = 0;
            if (!logClient?.id) {
                // find last log's timestamp
                lastLogTimestamp = (await this._db!.collection('log').find(
                    lastLogDataFilter, 
                    {
                        projection: {
                            _id: 0,
                            timestamp: 1
                        }
                    }
                )
                .sort({'timestamp': -1})
                .limit(1)
                .toArray())[0]?.timestamp ?? 0;
            }

            if (dbLog.timestamp! - lastLogTimestamp > logFreq) {
                await this._db!.collection('log').insertOne(dbLog);
            }

            return this.addLog(logClient);

        } catch (e) { }

        return undefined;
    }

    public getLogGui(
        clientId: string,
        spabLog: SpabLog
    ): Buffer {
        let logGui: SpabDataStruct.ILogGui = {
            clientId: clientId,
            timestamp: spabLog.timestamp,
            type: spabLog.type,
            data: Buffer.alloc(0)
        }

        if (spabLog.type === 'camera') {
            logGui.data = SpabDataStruct.CameraData.encode(spabLog.obj).finish();
        } else if (spabLog.type === 'sensor') {
            logGui.data = SpabDataStruct.SensorData.encode(spabLog.obj).finish();
        }

        return Buffer.from(SpabDataStruct.LogGui.encode(logGui).finish());
    }

    public addLog(
        log: DbLog
    ): SpabLog | undefined {

        if (!log.clientId) {
            return;
        }

        let clientId = log.clientId.toString();

        let spabClient = this.getClient(clientId);

        if (!spabClient) {
            return;
        }

        for (let spabLog of spabClient.latestLogs) {
            if (
                log.type === spabLog.type &&
                (
                    log.type === 'sensor' ||
                    (log.type === 'camera' && log.obj.name === spabLog.obj.name)
                )
            ) {
                if (log.timestamp && log.timestamp > spabLog.timestamp) {
                    spabLog.timestamp = log.timestamp;
                    spabLog.obj = log.obj;
                    return spabLog;
                } else {
                    return;
                }
            }
        }

        if (log.timestamp && (log.type === 'sensor' || log.type === 'camera')) {
            let spabLog: SpabLog = {
                type: log.type,
                timestamp: log.timestamp!,
                obj: log.obj
            };
            spabClient.latestLogs.push(spabLog);
            return spabLog;
        }

        return;
    }
}

export {
    DbLog,
    SpabLog,
    SpabClient,
    ClientStore
}