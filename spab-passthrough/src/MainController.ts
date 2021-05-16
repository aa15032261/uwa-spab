// import config file
import './Config';

import { authenticator } from 'otplib';
import { io, Socket } from 'socket.io-client';
import * as net from 'net';


export class MainController {

    private _socket: Socket;
    private _localSockets = new Set<net.Socket>();

    /**
     * MainController handles mavlink data passthrough
     */
    constructor() {
        // Initialise the passthrough socket
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

        // Creates a local tcp socket
        let server = net.createServer((socket) => {
            this._localSockets.add(socket);

            // send all data to the passthrough socket
            socket.on('data', (data: Buffer) => {
                if (this._checkOnline()) {
                    this._socket.emit('rawData', data);
                }
            });

            socket.on('end', () => {
                this._localSockets.delete(socket);
            });
        });
        server.on('error', (e) => { });
        server.listen(LOCAL_PORT, '127.0.0.1');


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
            // Reconnects in 30 seconds if kicked by the server
            this._disconnectHandler(reason);

            setTimeout(() => {
                this._socket.connect();
            }, 30000);
        });

        // Sends data to local tcp socket
        this._socket.on('rawData', (data: Buffer) => {
            for (let socket of this._localSockets) {
                socket.write(data);
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


    /**
     * Checks if the passthrough socket is connected to the server
     * @returns {boolean} - True if the socket is connected to the server, otherwise, false
     */
    private _checkOnline(): boolean {
        if (this._socket.connected) {
            return true;
        } else {
            return false;
        }
    }
}
