import WebSocket from 'ws';
import { WSServer } from '../src';

type ISocketMsgs = {
	TEST: { type: 'TEST'; test: string };
	TEST_2: { type: 'TEST_2'; test2: string };
	CONNECT: { type: 'CONNECT'; id: string };
};

type OSocketMsgs = {
	REPLY: { type: 'REPLY'; data: string };
};

let wss: WSServer<ISocketMsgs, OSocketMsgs>;
let socket: WebSocket;

describe('Server test suite', () => {
	describe('Self-constructing server & attaching to node http/s server objects', () => {
		it('Should construct & receive properly', async () => {
			return new Promise<void>((resolve) => {
				wss = new WSServer<ISocketMsgs, OSocketMsgs>(5000);
				socket = new WebSocket('ws://localhost:5000');

				socket.onopen = () => {
					socket.send(JSON.stringify({ type: 'TEST', test: 'test' }));
				};

				wss.on('connection', (client) => {
					client.on('TEST', (data) => {
						expect(data.test).toBe('test');
						resolve();
					});
				});
			});
		});

		it('Should get clients', async () => {
			return new Promise<void>((resolve) => {
				wss = new WSServer<ISocketMsgs, OSocketMsgs>(5000);
				socket = new WebSocket('ws://localhost:5000');

				wss.on('connection', (client) => {
					expect(wss.clients.length).toBe(1);
					expect(wss.clients[0]).toBe(client);
					resolve();
				});
			});
		});

		it('Should remove client on disconnect', async () => {
			return new Promise<void>((resolve) => {
				wss = new WSServer<ISocketMsgs, OSocketMsgs>(5000);
				socket = new WebSocket('ws://localhost:5000');

				socket.onopen = () => {
					socket.close();
				};

				wss.on('connection', (client) => {
					expect(wss.clients.length).toBe(1);
					expect(wss.clients[0]).toBe(client);
				});

				wss.on('disconnect', () => {
					expect(wss.clients.length).toBe(0);
					resolve();
				});
			});
		});

		it('Should broadcast properly', async () => {
			return new Promise<void>((resolve) => {
				wss = new WSServer<ISocketMsgs, OSocketMsgs>(5000);
				socket = new WebSocket('ws://localhost:5000');
				const sock2 = new WebSocket('ws://localhost:5000');

				wss.on('connection', () => {
					if (wss.clients.length === 2) {
						wss.broadcast({ type: 'REPLY', data: 'test' });
					}
				});

				socket.on('message', (data) => {
					expect(JSON.parse(data.toString())).toEqual({ type: 'REPLY', data: 'test' });
				});
				sock2.on('message', (data) => {
					expect(JSON.parse(data.toString())).toEqual({ type: 'REPLY', data: 'test' });
					sock2.close();
					resolve();
				});
			});
		});

		it('Should throw when trying to bind to an invalid event', async () => {
			return new Promise<void>((resolve) => {
				wss = new WSServer<ISocketMsgs, OSocketMsgs>(5000);
				socket = new WebSocket('ws://localhost:5000');

				expect(() => {
					// @ts-expect-error
					wss.on('invalid', () => {});
				}).toThrowError('WSServer#on(): Invalid event type: invalid');

				resolve();
			});
		});
	});

	describe('Attaching to an existing ws WebSocketServer', () => {
		it('Should construct & receive properly', async () => {
			return new Promise<void>((resolve) => {
				wss = new WSServer<ISocketMsgs, OSocketMsgs>(new WebSocket.Server({ port: 5000 }));
				socket = new WebSocket('ws://localhost:5000');

				socket.onopen = () => {
					socket.send(JSON.stringify({ type: 'TEST', test: 'test' }));
				};

				wss.on('connection', (client) => {
					client.on('TEST', (data) => {
						expect(data.test).toBe('test');
						resolve();
					});
				});
			});
		});

		it('Should get clients', async () => {
			return new Promise<void>((resolve) => {
				wss = new WSServer<ISocketMsgs, OSocketMsgs>(new WebSocket.Server({ port: 5000 }));
				socket = new WebSocket('ws://localhost:5000');

				wss.on('connection', (client) => {
					expect(wss.clients.length).toBe(1);
					expect(wss.clients[0]).toBe(client);
					resolve();
				});
			});
		});

		it('Should remove client on disconnect', async () => {
			return new Promise<void>((resolve) => {
				wss = new WSServer<ISocketMsgs, OSocketMsgs>(new WebSocket.Server({ port: 5000 }));
				socket = new WebSocket('ws://localhost:5000');

				socket.onopen = () => {
					socket.close();
				};

				wss.on('connection', (client) => {
					expect(wss.clients.length).toBe(1);
					expect(wss.clients[0]).toBe(client);
				});

				wss.on('disconnect', () => {
					expect(wss.clients.length).toBe(0);
					resolve();
				});
			});
		});
	});
});

afterEach(async () => {
	await new Promise<void>((resolve) => {
		if (socket.readyState === WebSocket.OPEN) {
			socket.close();
			socket.onclose = () => resolve();
		} else if (socket.readyState === WebSocket.CONNECTING) {
			socket.onopen = () => {
				socket.close();
				socket.onclose = () => resolve();
			};
		} else {
			resolve();
		}
	});

	await wss.close();
});
