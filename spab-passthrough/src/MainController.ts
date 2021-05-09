// import config file
import './Config';

import { authenticator } from 'otplib';
import { io, Socket } from 'socket.io-client';
import * as net from 'net';


export class MainController {

    private _socket: Socket;
    private _localSocket?: net.Socket;

    constructor() {
        // init socket io
        this._socket = io(SERVER_URL, {
            path: PASSTHROUGH_WSAPI_PATH,
            rejectUnauthorized: false,
            autoConnect: true,
            reconnectionDelayMax: 10000,
            reconnectionAttempts: Infinity,
            auth: (cb) => {
                let authObj = {
                    token: CLIENT_API_TOKEN,
                    twoFactor: ''
                };

                if (CLIENT_TWO_FACTOR.type === 'totp') {
                    authObj.twoFactor = authenticator.generate(CLIENT_TWO_FACTOR.secret);
                }

                cb(authObj);
            }
        });

        net.createServer((socket) => {
            this._localSocket = socket;

            socket.on('data', (data: Buffer) => {
                if (this._checkOnline()) {
                    this._socket.emit('rawData', data);
                }
            });
        });

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

            // reconnect in 30 seconds if kicked by the server
            setTimeout(() => {
                this._socket.connect();
            }, 30000);
        });

        this._socket.on('rawData', (data: Buffer) => {
            if (this._localSocket) {
                this._localSocket.write(data);
            }
        });
    }

    private _connectHandler() {
        console.log('server connected');

        this._socket.sendBuffer = [];
    }

    private _disconnectHandler(err: any) {
        console.log('server disconnected');
    };

    private _checkOnline(): boolean {
        if (this._socket.connected) {
            return true;
        } else {
            return false;
        }
    }
}
