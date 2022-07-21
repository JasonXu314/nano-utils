import { EventSrc, Unsubscriber } from '@nano-utils/evt-src';
import http from 'http';
import https from 'https';
import WebSocket from 'ws';
import { Socket } from './server-socket';
import { SocketMsg } from './types';

export class WSServer<
	IM extends { [K in IT]: SocketMsg<K> },
	OM extends { [K in OT]: SocketMsg<K> },
	IT extends string | number | symbol = keyof IM,
	OT extends string | number | symbol = keyof OM
> {
	private _wss: WebSocket.WebSocketServer;
	private _clients: Socket<IM, OM, IT, OT>[];
	private _events: EventSrc<{ connection: Socket<IM, OM, IT, OT>; disconnect: Socket<IM, OM, IT, OT> }>;
	private _server: http.Server | https.Server | null = null;

	constructor(server: WebSocket.WebSocketServer | http.Server | https.Server | number) {
		if (typeof server === 'number') {
			const port = server;
			server = http.createServer();
			server.listen(port);
			this._server = server;
		}

		if (server instanceof WebSocket.WebSocketServer) {
			this._wss = server;
			this._clients = [];
			this._events = new EventSrc();

			this._wss.on('connection', (socket) => {
				const client = new Socket<IM, OM, IT, OT>(socket);
				this._clients.push(client);

				this._events.dispatch('connection', client);

				socket.on('close', () => {
					this._clients = this._clients.filter((c) => c !== client);
					this._events.dispatch('disconnect', client);
				});
			});
		} else {
			this._wss = new WebSocket.Server({ server });
			this._clients = [];
			this._events = new EventSrc();

			this._wss.on('connection', (socket) => {
				const client = new Socket<IM, OM, IT, OT>(socket);
				this._clients.push(client);

				this._events.dispatch('connection', client);

				socket.on('close', () => {
					this._clients = this._clients.filter((c) => c !== client);
					this._events.dispatch('disconnect', client);
				});
			});
		}
	}

	public on(evt: 'connection', cb: (client: Socket<IM, OM, IT, OT>) => void): Unsubscriber;
	public on(evt: 'disconnect', cb: (client: Socket<IM, OM, IT, OT>) => void): Unsubscriber;
	public on(evt: 'connection' | 'disconnect', cb: (client: Socket<IM, OM, IT, OT>) => void): Unsubscriber {
		switch (evt) {
			case 'connection':
				return this._events.on('connection', cb);
			case 'disconnect':
				return this._events.on('disconnect', cb);
			default:
				throw new Error(`WSServer#on(): Invalid event type: ${evt}`);
		}
	}

	public broadcast(msg: OM[keyof OM]): void {
		this._clients.forEach((client) => client.send(msg));
	}

	public get clients(): Socket<IM, OM, IT, OT>[] {
		return this._clients;
	}

	public async close(): Promise<void> {
		return new Promise<void>((resolve) => {
			this._clients = [];
			this._wss.close();
			if (this._server) {
				this._server.close(() => resolve());
			} else {
				this._wss.on('close', () => resolve());
			}
		});
	}
}
