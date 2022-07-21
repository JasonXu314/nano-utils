import { WSServer } from '../src/server';

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
	it('Should construct & receive properly', () => {});
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
