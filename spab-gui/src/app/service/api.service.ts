import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval } from 'rxjs';

import { io, Socket } from "socket.io-client";

import { SpabDataStruct } from "./../../../../spab-data-struct/SpabDataStruct";

interface SpabClientSummary {
  clientId: string,
  name: string,
  connected: boolean,
  logStartTimestamp: number,
  logEndTimestamp: number,
  latestLogs: SpabLog[]
}
interface SpabLog {
  type: 'camera' | 'sensor',
  typeId: string,
  timestamp: number,
  data: Uint8Array
}


@Injectable({
  providedIn: 'root'
})
class ApiService {

  private _socket: Socket;
  private _clients: SpabClientSummary[] = [];
  private _subscribedClientIds = new Set<string>();

  private _statustListeners = new Map<string, (online: boolean) => void>();
  private _logListeners = new Map<string, (clientId: string, log: SpabLog, latest: boolean) => void>();
  private _clientStatusListeners = new Map<string, (clientId: string, online: boolean) => void>();

  constructor(
    http: HttpClient
  ) {
    // heartbeat signal
    interval(5 * 60 * 1000).subscribe(async () => {
      try {
        await http.get('/api/heartbeat').toPromise();
      } catch (e) { }
    });


    // init socket io
    this._socket = io(
      'wss://therevproject.com',
      {
        path: '/spab_2021s1/api/gui_ws/',
        rejectUnauthorized: false,
        autoConnect: true,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: Infinity
      }
    );

    this._socket.on('connect', async () => {
      await this._connectHandler();
    });

    this._socket.on('reconnect', async () => {
      await this._connectHandler();
    });

    this._socket.on('connect_error', (err: any) => {
      this._disconnectHandler(err);
    });

    this._socket.on('disconnect', (reason: string) => {
      this._disconnectHandler(reason);

      // reconnect in 15 seconds if kicked by the server
      setTimeout(() => {
        this._socket.connect();
      }, 15000);
    });



    this._socket.on('online', (clientId: string, ackResponse: Function) => {
      if (!(ackResponse instanceof Function)) {
        return;
      }

      ackResponse(true);

      this._setClientStatus(clientId, true);
      this._notifyClientStatusListeners(clientId, true);
    });

    this._socket.on('offline', (clientId: string, ackResponse: Function) => {
      if (!(ackResponse instanceof Function)) {
        return;
      }

      ackResponse(true);

      this._setClientStatus(clientId, false);
      this._notifyClientStatusListeners(clientId, false);
    });

    this._socket.on('log', (logGuiEncoded: Uint8Array, ackResponse: Function) => {
      if (ackResponse instanceof Function) {
        ackResponse(true);
      }

      try {
        let logGui = SpabDataStruct.LogGui.decode(new Uint8Array(logGuiEncoded));

        let spabLog: SpabLog | undefined = {
          timestamp: logGui.timestamp,
          type: logGui.type as 'camera' | 'sensor',
          typeId: logGui.typeId,
          data: new Uint8Array(logGui.data)
        };

        let latest = false;
        if (this._updateLatestLog(logGui.clientId, spabLog)) {
          latest = true;
        }

        this._notifyLogListeners(logGui.clientId, spabLog, latest);

      } catch (err) {}
    });
  }

  private async _connectHandler() {
    let newClients = await this._sendMsgAck('get', ['clients'], true);

    if (!newClients) {
      return;
    }

    this._clients = newClients;

    // initialise client object &
    // remove invalid client ids from subscribed ids
    let newSubscribedClientIds = new Set<string>();

    for (let client of this._clients) {
      client.latestLogs = [];
      client.logEndTimestamp = client.logStartTimestamp;

      if (this._subscribedClientIds.has(client.clientId)) {
        newSubscribedClientIds.add(client.clientId);
      }
    }

    this._subscribedClientIds = newSubscribedClientIds;

    for (let subscribedClientId of this._subscribedClientIds) {
      this._sendMsgAck('subscribe', [subscribedClientId], true);
    }

    this._notifyStatusListeners();
  }

  private _disconnectHandler(err: any) {
    this._notifyStatusListeners();
  }

  private _setClientStatus(clientId: string, isOnline: boolean) {
    for (let client of this._clients) {
      if (client.clientId === clientId) {
        client.connected = isOnline;
      }
    }
  }

  private _updateLatestLog(
    clientId: string,
    log: SpabLog
  ): SpabLog | undefined {

    let selectedClient = this.getClient(clientId);

    if (!selectedClient) {
      return;
    }

    if (log.timestamp > selectedClient.logEndTimestamp) {
      selectedClient.logEndTimestamp = log.timestamp!;
    } else if (log.timestamp! < selectedClient.logStartTimestamp) {
      selectedClient.logStartTimestamp = log.timestamp!;
    }

    for (let spabLog of selectedClient.latestLogs) {
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

    if (log.timestamp && (log.type === 'sensor' || log.type === 'camera')) {
      let spabLog: SpabLog = {
        type: log.type,
        typeId: log.typeId,
        timestamp: log.timestamp!,
        data: log.data
      };
      selectedClient.latestLogs.push(spabLog);
      return spabLog;
    }

    return;
  }

  private async _sendMsgAck(
    evt: string,
    values: any[],
    ack: boolean
  ): Promise<any> {
    if (ack) {
      for (let i = 0; i < 3; i++) {
        try {
          return await this._sendMsgAckOnce(evt, values, (i + 1) * 10000);
        } catch (e) { };
      }
    } else {
      this._socket.emit(evt, ...values);
    }
    return;
  }

  private _sendMsgAckOnce(
    evt: string,
    values: any[],
    timeout: number
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        reject()
      }, timeout);

      this._socket.emit(evt, ...values, (res: any) => {
        resolve(res);
      });
    })
  }

  public async subscribe(clientId: string) {
    for (let client of this._clients) {
      if (client.clientId === clientId) {
        if (!this._subscribedClientIds.has(clientId)) {
          this._subscribedClientIds.add(clientId);
          await this._sendMsgAck('subscribe', [clientId], true);
        }
      }
    }
  }

  public async getLogs(clientId: string, timestamp: number) {
    await this._sendMsgAck('log', [clientId, timestamp], true);
  }

  public async unsubscribeAll() {
    this._subscribedClientIds = new Set<string>();
    await this._sendMsgAck('unsubscribeAll', [], true);
  }

  private _notifyLogListeners(clientId: string, log: SpabLog, latest: boolean) {
    for (let [id, cb] of this._logListeners) {
      cb(clientId, log, latest);
    }
  }
  public addLogListener(id: string, cb: (clientId: string, log: SpabLog, latest: boolean) => void) {
    this._logListeners.set(id, cb);

    for (let client of this._clients) {
      for (let log of client.latestLogs) {
        cb(client.clientId, log, true);
      }
    }
  }
  public removeLogListener(id: string) {
    this._logListeners.delete(id);
  }


  private _notifyClientStatusListeners(clientId: string, online: boolean) {
    for (let [id, cb] of this._clientStatusListeners) {
      cb(clientId, online);
    }
  }
  public addClientStatusListener(id: string, cb: (clientId: string, online: boolean) => void) {
    this._clientStatusListeners.set(id, cb);

    for (let client of this._clients) {
      cb(client.clientId, client.connected);
    }
  }
  public removeClientStatusListener(id: string) {
    this._clientStatusListeners.delete(id);
  }


  private _notifyStatusListeners() {
    for (let [id, cb] of this._statustListeners) {
      cb(this._socket.connected);
    }
  }
  public addStatusListener(id: string, cb: (online: boolean) => void) {
    this._statustListeners.set(id, cb);
    cb(this._socket.connected);
  }
  public removeStatusListener(id: string) {
    this._statustListeners.delete(id);
  }

  public getClient(clientId: string): SpabClientSummary | undefined {
    for (let client of this._clients) {
      if (client.clientId === clientId) {
        return client;
      }
    }
    return;
  }

  get clients(): Readonly<SpabClientSummary>[] {
    return this._clients;
  }

  get subscribedClientIds(): Readonly<Set<string>> {
    return this._subscribedClientIds;
  }
}

export {
  SpabLog,
  SpabClientSummary,
  ApiService
}