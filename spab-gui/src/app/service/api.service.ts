import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval } from 'rxjs';

import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _socket: Socket;

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

    this._socket.on('connect', () => {
      this._connectHandler();
    });

    this._socket.on('reconnect', () => {
      this._connectHandler();
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

  private _connectHandler() {

  }

  private _disconnectHandler(err: any) {
    
  }

}
