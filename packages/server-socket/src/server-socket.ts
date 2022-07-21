import { EventSrc, EvtListener, Unsubscriber } from '@nano-utils/evt-src';
import WebSocket from 'ws';
import { SocketMsg } from './types';

/**
 * A wrapper class around the ws WebSocket API
 */
export class Socket<
	IM extends { [K in IT]: SocketMsg<K> },
	OM extends { [K in OT]: SocketMsg<K> },
	IT extends string | number | symbol = keyof IM,
	OT extends string | number | symbol = keyof OM
> {
	private _socket: WebSocket;
	private _events: EventSrc<{ [K in keyof IM]: IM[K] }>;

	/**
	 * Creates a new Socket object with the underlying WebSocket as the given WebSocket
	 * @param socket the existing WebSocket
	 */
	constructor(socket: WebSocket) {
		this._socket = socket;
		this._events = new EventSrc();

		this._socket.on('message', (data) => {
			if (Array.isArray(data)) {
				const msg = data.reduce((acc, cur) => acc + cur.toString(), '');
				const msgObj = JSON.parse(msg) as IM[keyof IM];

				this._events.dispatch(msgObj.type as keyof IM, msgObj);
			} else {
				const msg = JSON.parse(data.toString()) as IM[keyof IM];
				this._events.dispatch(msg.type as keyof IM, msg);
			}
		});
	}

	/**
	 * Sends the given message. If the socket is not open, will automatically queue it to be sent upon opening.
	 * @param msg the message to send
	 */
	public send<M extends keyof OM>(msg: OM[M]): void {
		if (this._socket.readyState === WebSocket.OPEN) {
			this._socket.send(JSON.stringify(msg));
		} else if (this._socket.readyState === WebSocket.CLOSED) {
			throw new Error('Socket#close(): Attempted to send message on closed socket.');
		}
	}

	/**
	 * Attaches the given listener to listen for the given event
	 * @param msgType the type of the message to listen for
	 * @param listener the callback to be called
	 * @returns a function that will remove the listener upon call
	 */
	public on<M extends keyof IM>(msgType: M, listener: EvtListener<IM[M]>): Unsubscriber {
		return this._events.on<M>(msgType, listener);
	}

	/**
	 * Attaches the given listener to listen for the given event, but will automatically remove it after 1 call
	 * @param msgType the type of the message to listen for
	 * @param listener the callback to be called
	 * @returns a function that will remove the listener upon call
	 */
	public once<M extends keyof IM>(msgType: M, listener: EvtListener<IM[M]>): Unsubscriber {
		const unsubscribe = this._events.on<M>(msgType, (msg: IM[M]) => {
			listener(msg);
			unsubscribe();
		});

		return unsubscribe;
	}

	/**
	 * Used to wait for the next message of the given type using async/await
	 * @param msgType the type of the message to wait for
	 * @returns a promise that resolves with the next message received of the given type, when it is received
	 */
	public async await<M extends keyof IM>(msgType: M): Promise<IM[M]> {
		return new Promise((resolve) => {
			this.once(msgType, (msg) => resolve(msg));
		});
	}

	/**
	 * Closes the socket
	 */
	public async close(): Promise<void> {
		return new Promise((resolve) => {
			this._socket.close();
			this._socket.on('close', () => resolve());
		});
	}
}
