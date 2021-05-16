"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientStore = void 0;
const tslib_1 = require("tslib");
const SpabDataStruct_1 = require("./../../spab-data-struct/SpabDataStruct");
class ClientStore {
    /**
     * ClientStore manages client logs and connection status
     */
    constructor() {
        /** Client map
         * Key: client id
         * Value: SpabClient object
         */
        this._clientMap = new Map();
    }
    /**
     * Update Postgre database pool
     *
     * @param {Pool} pool - Postgre pool
     */
    updateDbPool(pool) {
        this._pool = pool;
        this._updateClientMap();
    }
    /**
     * Fetches clients from the database periodically and updates the client map
     */
    _updateClientMap() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._pool) {
                return;
            }
            // Clears the old update timeout
            if (this._clientMapUpdateTimer) {
                clearTimeout(this._clientMapUpdateTimer);
            }
            // Setup a new update timeout
            this._clientMapUpdateTimer = setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield this._updateClientMap();
            }), 5 * 60 * 1000);
            try {
                // Gets all client ids
                let newClientIdSet = new Set();
                let clientRows = (yield this._pool.query(`SELECT "_id", "name" FROM clients`)).rows;
                for (let clientRow of clientRows) {
                    newClientIdSet.add(clientRow._id);
                }
                // Removes deleted clients from client map
                for (let [clientId, client] of this._clientMap) {
                    if (!newClientIdSet.has(client.clientId)) {
                        this._clientMap.delete(clientId);
                    }
                }
                // For each row, creates a new SpabClient object and saves to the map
                for (let clientRow of clientRows) {
                    try {
                        let client = yield this.createClient(clientRow._id, clientRow.name);
                        let oldClient = this._clientMap.get(clientRow._id);
                        if (oldClient) {
                            client.socketIds = oldClient.socketIds;
                        }
                        this._clientMap.set(clientRow._id, client);
                    }
                    catch (e) { }
                }
            }
            catch (e) { }
        });
    }
    /**
     * Creates a new SpabClient object
     *
     * @param {string} clientId - Client id
     * @param {string} name - Client name
     * @returns {Promise<SpabClient>} - The SpabClient object
     */
    createClient(clientId, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let client = {
                clientId: clientId,
                name: name,
                socketIds: new Set(),
                logStartTimestamp: 0,
                latestLogs: []
            };
            // Gets the timestamp of the first log
            let logStartTimestampRes = (yield this._pool.query(`SELECT 
                MIN(timestamp) AS timestamp 
            FROM logs 
            WHERE
            "clientId"=$1;`, [clientId])).rows;
            // If there is no logs, set the start timestamp to current timestamp
            if (logStartTimestampRes) {
                client.logStartTimestamp = logStartTimestampRes[0].timestamp;
            }
            else {
                client.logStartTimestamp = (new Date()).getTime();
            }
            // Fetches the most recent logs from the database
            let latestLogs = yield this.getLogs(clientId, -1);
            client.latestLogs = latestLogs;
            return client;
        });
    }
    /**
     * Get logs from database by timestamp.
     *
     * If timestamp is a negative number, the function returns the most recent logs.
     *
     * @param {string} clientId - Client id
     * @param {number} timestamp - Log timestamp
     * @returns {Promise<SpabLog[]>}
     */
    getLogs(clientId, timestamp) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let logs = [];
            if (!timestamp || timestamp < 0) {
                timestamp = Number.MAX_SAFE_INTEGER;
            }
            // For each log type, fetches the most recent logs from the database
            let types = ['sensor', 'camera'];
            for (let type of types) {
                let latestLogRows = (yield this._pool.query(`SELECT DISTINCT ON ("typeId")
                    "timestamp",
                    "type",
                    "typeId",
                    "data"
                FROM logs
                WHERE
                    "clientId"=$1 AND
                    "type"=$2 AND
                    "timestamp" < $3
                ORDER BY "typeId", "timestamp" DESC;`, [clientId, type, timestamp])).rows;
                for (let logRow of latestLogRows) {
                    try {
                        logs.push({
                            timestamp: logRow.timestamp,
                            type: logRow.type,
                            typeId: logRow.typeId,
                            data: Buffer.from(logRow.data)
                        });
                    }
                    catch (e) { }
                }
            }
            return logs;
        });
    }
    /**
     * Adds a socket id to a client
     *
     * @param {string} clientId - Client id
     * @param {string} socketId - Socket id
     * @returns {boolean} - True if the operation is successful, otherwise, false
     */
    addClientSocketId(clientId, socketId) {
        let client = this._clientMap.get(clientId);
        if (client) {
            client.socketIds.add(socketId);
            return true;
        }
        return false;
    }
    /**
     * Removes a socket id from a client
     *
     * @param {string} clientId - Client id
     * @param {string} socketId - Socket id
     * @returns {boolean} - True if the operation is successful, otherwise, false
     */
    removeClientSocketId(clientId, socketId) {
        let client = this._clientMap.get(clientId);
        if (client) {
            client.socketIds.delete(socketId);
            return true;
        }
        return false;
    }
    /**
     * Gets client summary list
     *
     * @returns {SpabClientSummary[]}
     */
    getClientSummary() {
        let clientList = [];
        for (let [clientId, client] of this._clientMap) {
            clientList.push({
                clientId: clientId,
                name: client.name,
                connected: client.socketIds.size > 0,
                logStartTimestamp: client.logStartTimestamp
            });
        }
        return clientList;
    }
    /**
     * Checks if the client exists
     *
     * @param {string} clientId - Client id
     * @returns {boolean} - True if the client exists, otherwise, false
     */
    isClientExist(clientId) {
        if (this._clientMap.has(clientId)) {
            return true;
        }
        return false;
    }
    /**
     * Gets client's socket count
     *
     * @param {string} clientId - Client id
     * @returns {number}
     */
    getSocketCount(clientId) {
        var _a;
        return ((_a = this._clientMap.get(clientId)) === null || _a === void 0 ? void 0 : _a.socketIds.size) || 0;
    }
    /**
     * Gets the SpabClient object by client id
     *
     * @param {string} clientId - Client id
     * @returns {SpabClient | undefined} -
     * If the client exists, the function returns client's SpabClient object, otherwise, undefined.
     */
    getClient(clientId) {
        return this._clientMap.get(clientId);
    }
    /**
     * Decodes a LogClient buffer and saves the log to the database
     *
     * @param {string} clientId - Client id
     * @param {Buffer} logClientEncoded - LogClient buffer
     * @returns {Promise<SpabLog | undefined>} -
     * If the log is successfully added to the database, the function returns the SpabLog object of the log,
     * otherwise, undefined
     */
    addLogEncoded(clientId, logClientEncoded) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let logClient;
            try {
                logClient = SpabDataStruct_1.SpabDataStruct.LogClient.decode(new Uint8Array(logClientEncoded));
                if (!logClient) {
                    return;
                }
                let client = (yield this._pool.query(`SELECT "_id" FROM clients WHERE "_id"=$1`, [clientId])).rows[0];
                if (!client) {
                    return;
                }
                if (logClient.logId) {
                    // Only cached logs have a log id
                    // Checks if the timestamp is valid
                    if (logClient.timestamp > (new Date()).getTime() + 5 * 60 * 1000) {
                        return;
                    }
                    // Checks if the cached log is already added to the database
                    let existingLog = (yield this._pool.query(`SELECT "logId" FROM logs WHERE "clientId"=$1 AND "timestamp"=$2 AND "logId"=$3`, [clientId, logClient.timestamp, logClient.logId])).rows[0];
                    if (existingLog) {
                        return;
                    }
                }
                else {
                    // Real time logs
                    logClient.timestamp = (new Date()).getTime();
                    delete logClient.logId;
                }
                let dbLog = logClient;
                dbLog.clientId = clientId;
                // Limiting the frequency of the logs based on the type
                let logFreq = 60 * 1000;
                if (logClient.type === 'camera') {
                    logFreq = 60 * 1000;
                }
                else if (logClient.type === 'sensor') {
                    logFreq = 30 * 1000;
                }
                if (!logClient.data) {
                    logClient.data = new Uint8Array();
                }
                // Removes deleted properties
                dbLog = Object.assign({}, dbLog);
                let lastLogTimestamp = 0;
                if (!logClient.logId) {
                    // Gets the most recent log's timestamp
                    let latestLog = (yield this._pool.query(`SELECT MAX("timestamp") as "timestamp" FROM logs WHERE "clientId"=$1 AND "type"=$2 AND "typeId"=$3 AND "logId" IS NULL`, [clientId, logClient.type, logClient.typeId])).rows[0];
                    if (latestLog && latestLog.timestamp) {
                        lastLogTimestamp = latestLog.timestamp;
                    }
                }
                if (dbLog.timestamp - lastLogTimestamp > logFreq) {
                    yield this._pool.query(`INSERT INTO logs ("clientId", "timestamp", "logId", "type", "typeId", "data") VALUES ($1, $2, $3, $4, $5, $6)`, [clientId, dbLog.timestamp, dbLog.logId, dbLog.type, dbLog.typeId, Buffer.from(dbLog.data)]);
                }
                return this._updateLatestLog(logClient);
            }
            catch (e) {
                console.log(e);
            }
            return undefined;
        });
    }
    /**
     * Creates a LogGui buffer from a SpabLog
     *
     * @param {string} clientId - Client id
     * @param {SpabLog} spabLog - SpabLog object
     * @returns {Buffer} - LogGui buffer
     */
    getLogGui(clientId, spabLog) {
        let logGui = {
            clientId: clientId,
            logStartTimestamp: -1,
            timestamp: spabLog.timestamp,
            type: spabLog.type,
            typeId: spabLog.typeId,
            data: spabLog.data,
        };
        let spabClient = this.getClient(clientId);
        if (spabClient) {
            logGui.logStartTimestamp = spabClient.logStartTimestamp;
        }
        return Buffer.from(SpabDataStruct_1.SpabDataStruct.LogGui.encode(logGui).finish());
    }
    /**
     * Inserts a DbLog to a client and updates its latestLogs array
     *
     * @param {DbLog} log - DbLog object
     * @returns {SpabLog | undefined} -
     * If the inserting log is newer than the log in the latestLogs array,
     * the function returns the SpabLog object of the log,
     * otherwise, undefined
     */
    _updateLatestLog(log) {
        if (!log.clientId) {
            return;
        }
        let clientId = log.clientId.toString();
        let spabClient = this.getClient(clientId);
        if (!spabClient) {
            return;
        }
        // Checks with the timestamp of the first log
        if (log.timestamp < spabClient.logStartTimestamp) {
            spabClient.logStartTimestamp = log.timestamp;
        }
        // If the log type exists in latestLogs array, 
        // updates the existing object
        for (let spabLog of spabClient.latestLogs) {
            if (log.type === spabLog.type &&
                log.typeId === spabLog.typeId) {
                if (log.timestamp && log.timestamp > spabLog.timestamp) {
                    spabLog.timestamp = log.timestamp;
                    spabLog.data = Buffer.from(log.data);
                    return spabLog;
                }
                else {
                    return;
                }
            }
        }
        // If the log type doesnt exist in latestLogs array,
        // appends the log to the array
        if (log.type === 'camera' || log.type === 'sensor') {
            let spabLog = {
                type: log.type,
                typeId: log.typeId,
                timestamp: log.timestamp,
                data: Buffer.from(log.data)
            };
            spabClient.latestLogs.push(spabLog);
            return spabLog;
        }
        return;
    }
}
exports.ClientStore = ClientStore;
