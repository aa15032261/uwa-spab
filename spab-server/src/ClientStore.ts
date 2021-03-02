import * as mongodb from 'mongodb';
import { SpabDataStruct } from "./../../spab-data-struct/SpabDataStruct";


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
                client.latestLogs.push({
                    timestamp: log.timestamp,
                    type: log.type,
                    obj: log.obj
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

    public addLog(
        log: SpabDataStruct.ILog & {clientId?: mongodb.ObjectId, obj?: any}
    ): SpabLog | undefined {

        if (!log.clientId) {
            return;
        }

        let clientId = log.clientId.toString();

        let spabClient = this.getClient(clientId);

        if (!spabClient) {
            return;
        }

        for (let spabLog of spabClient?.latestLogs) {
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
                } else {
                    return;
                }
            }
        }

        return;
    }
}

export {
    SpabClient,
    ClientStore
}