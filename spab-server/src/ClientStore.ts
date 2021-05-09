import { Pool } from "pg";
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";


interface DbLog extends SpabDataStruct.ILogClient {
    clientId?: string
}

interface SpabLog  {
    type: 'camera' | 'sensor',
    typeId: string,
    timestamp: number,
    data: any
}

interface SpabClient {
    clientId: string,
    name: string,
    socketIds: Set<string>,
    logStartTimestamp: number,
    latestLogs: SpabLog[]
}

interface SpabClientSummary {
    clientId: string, 
    name: string, 
    connected: boolean,
    logStartTimestamp: number
}

class ClientStore {

    private _pool?: Pool;
    private _clientStore = new Map<string, SpabClient>();

    private _clientStoreUpdateTimer?: ReturnType<typeof setTimeout>;

    constructor() { }

    public updateDbPool(pool: Pool) {
        this._pool = pool;
        this._updateClientList();
    }

    private async _updateClientList() {
        if (!this._pool) {
            return;
        }

        if (this._clientStoreUpdateTimer) {
            clearTimeout(this._clientStoreUpdateTimer);
        }

        this._clientStoreUpdateTimer = setTimeout(async () => {
            await this._updateClientList();
        }, 15 * 60 * 1000);

        try {
            let newClientIdSet = new Set<string>();
            let existingClientIdSet = new Set<string>();

            let clientObjs = (await this._pool!.query(
                `SELECT "_id", "name" FROM clients`
            )).rows;

            for (let clientObj of clientObjs) {
                clientObj.clientId = clientObj._id;
                newClientIdSet.add(clientObj._id);
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
                logStartTimestamp: 0,
                latestLogs: []
            };

            let logStartTimestampRes = (await this._pool!.query(
                `SELECT 
                    MIN(timestamp) AS timestamp 
                FROM logs 
                WHERE
                "clientId"=$1;`,
                [clientId]
            )).rows;

            if (logStartTimestampRes) {
                client.logStartTimestamp = logStartTimestampRes[0].timestamp;
            }

            let latestLogs = await this.getLogs(clientId, -1);
            client.latestLogs = latestLogs;
            this._clientStore.set(clientId, client);
        }
    }

    public async getLogs(clientId: string, timestamp: number): Promise<SpabLog[]> {
        let logs: SpabLog[] = [];

        if (!timestamp || timestamp < 0) {
            timestamp = Number.MAX_SAFE_INTEGER;
        }

        let types = ['sensor', 'camera'];

        for (let type of types) {
            let latestLogs = (await this._pool!.query(
                `SELECT DISTINCT ON ("typeId")
                    "timestamp",
                    "type",
                    "typeId",
                    "data"
                FROM logs
                WHERE
                    "clientId"=$1 AND
                    "type"=$2 AND
                    "timestamp" < $3
                ORDER BY "typeId", "timestamp" DESC;`,
                [clientId, type, timestamp]
            )).rows;

            for (let log of latestLogs) {
                try {
                    logs.push({
                        timestamp: log.timestamp,
                        type: log.type,
                        typeId: log.typeId,
                        data: Buffer.from(log.data)
                    });
                } catch (e) {

                }
            }
        }

        return logs;
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
                connected: client.socketIds.size > 0,
                logStartTimestamp: client.logStartTimestamp
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

        try {
            logClient = SpabDataStruct.LogClient.decode(new Uint8Array(logClientEncoded));

            if (!logClient) {
                return;
            }

            let client = (await this._pool!.query(
                `SELECT "_id" FROM clients WHERE "_id"=$1`,
                [clientId]
            )).rows[0];
            
            if (!client) {
                return;
            }

            if (logClient.logId) {
                // cached data

                // invalid timestamp
                if (logClient.timestamp! > (new Date()).getTime() + 5 * 60 * 1000) {
                    return;
                }

                // check if the cached log is in the database
                let existingLog = (await this._pool!.query(
                    `SELECT "logId" FROM logs WHERE "clientId"=$1 AND "timestamp"=$2 AND "logId"=$3`,
                    [clientId, logClient.timestamp, logClient.logId]
                )).rows[0];

                if (existingLog) {
                    return;
                }
            } else {
                // real time data
                logClient.timestamp = (new Date()).getTime();
                delete logClient.logId;
            }


            let dbLog: DbLog = logClient;
            dbLog.clientId = clientId;

            let logFreq = 60 * 1000;

            if (logClient.type === 'camera') {
                logFreq = 60 * 1000;
            } else if (logClient.type === 'sensor') {
                logFreq = 30 * 1000;
            }

            if (!logClient.data) {
                logClient.data = new Uint8Array();
            }


            // forcefully remove deleted properties
            dbLog = {...dbLog};

            let lastLogTimestamp = 0;
            if (!logClient.logId) {
                // find last log's timestamp
                let latestLog = (await this._pool!.query(
                    `SELECT MAX("timestamp") as "timestamp" FROM logs WHERE "clientId"=$1 AND "type"=$2 AND "typeId"=$3 AND "logId" IS NULL`,
                    [clientId, logClient.type, logClient.typeId]
                )).rows[0];

                if (latestLog && latestLog.timestamp) {
                    lastLogTimestamp = latestLog.timestamp;
                }
            }

            if (dbLog.timestamp! - lastLogTimestamp > logFreq) {
                await this._pool!.query(
                    `INSERT INTO logs ("clientId", "timestamp", "logId", "type", "typeId", "data") VALUES ($1, $2, $3, $4, $5, $6)`,
                    [clientId, dbLog.timestamp, dbLog.logId, dbLog.type, dbLog.typeId, Buffer.from(dbLog.data!)]
                );
            }

            return this._updateLatestLog(logClient);

        } catch (e) {
            console.log(e);
        }

        return undefined;
    }

    public getLogGui(
        clientId: string,
        spabLog: SpabLog
    ): Buffer {
        let logGui: SpabDataStruct.ILogGui = {
            clientId: clientId,
            logStartTimestamp: -1,
            timestamp: spabLog.timestamp,
            type: spabLog.type,
            typeId: spabLog.typeId,
            data: spabLog.data,
        }

        let spabClient = this.getClient(clientId);

        if (spabClient) {
            logGui.logStartTimestamp = spabClient.logStartTimestamp;
        }

        return Buffer.from(SpabDataStruct.LogGui.encode(logGui).finish());
    }

    private _updateLatestLog(
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

        if (log.timestamp! < spabClient.logStartTimestamp) {
            spabClient.logStartTimestamp = log.timestamp!;
        }

        // update existing log
        for (let spabLog of spabClient.latestLogs) {
            if (
                log.type === spabLog.type &&
                log.typeId === spabLog.typeId
            ) {
                if (log.timestamp && log.timestamp > spabLog.timestamp) {
                    spabLog.timestamp = log.timestamp;
                    spabLog.data = log.data;
                    return spabLog;
                } else {
                    return;
                }
            }
        }

        // insert log
        if (log.type === 'camera' || log.type === 'sensor') {
            let spabLog: SpabLog = {
                type: log.type,
                typeId: log.typeId!,
                timestamp: log.timestamp!,
                data: log.data
            }
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