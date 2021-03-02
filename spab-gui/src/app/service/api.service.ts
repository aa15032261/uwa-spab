import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval } from 'rxjs';

import { io, Socket } from "socket.io-client";

interface SpabClientSummary {
  clientId: string, 
  name: string, 
  connected: boolean
}



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _socket: Socket;
  private _clients: SpabClientSummary[] = [];



  constructor(
    http: HttpClient
  ) {
    // heartbeat signal
    interval(5 * 60 * 1000).subscribe(async () => {
      try {
        await http.get('/api/heartbeat').toPromise();
      } catch(e) { }
    });


    // init socket io
    this._socket = io(
      'wss://spab.toms.directory', 
      {
        path: '/api/gui_ws/',
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
  }

  private async _connectHandler() {
    let newClients = await this._sendMsgAck(
      this._socket,
      'get',
      'clients'
    );

    if (newClients) {
      this._clients = newClients;
    }
  }

  private _disconnectHandler(err: any) {
    
  }

  private async _sendMsgAck(
    socket: Socket, 
    evt: string, 
    val: any
  ): Promise<any> {
      for (let i = 0; i < 3; i++) {
          try {
              return await this._sendMsgAckOnce(socket, evt, val, (i + 1) * 10000);
          } catch (e) {};
      }
  }

  private _sendMsgAckOnce(
      socket: Socket, 
      evt: string, 
      val: any,
      timeout: number
  ): Promise<any> {
      return new Promise<any>((resolve, reject) => {
          setTimeout(() => {
              reject()
          }, timeout);

          socket.emit(evt, val, (res: any) => {
            resolve(res);
          })
      })
  }


  get clients(): Readonly<SpabClientSummary>[] {
    return this._clients;
  }
}
