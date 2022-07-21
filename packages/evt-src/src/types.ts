export type Primitives = string | number | boolean | symbol | ((...args: any) => any);
export type EventArg = Primitives | { [key: string | number | symbol]: EventArg } | EventArg[];

export interface HostEventSource<T extends EventMap<E>, E extends string | number | symbol = keyof T> {
	addEventListener<K extends keyof T>(type: K, listener: (evt: T[K]) => any): void;
	removeEventListener<K extends keyof T>(type: K, listener: (evt: T[K]) => any): void;
}

export type EventMap<E extends string | number | symbol> = { [K in E]: EventArg | any };

export type EvtListener<T extends EventArg> = (evt: T) => any;

export type Unsubscriber = () => void;

export type ListenerMap<T extends EventMap<E>, E extends string | number | symbol = keyof T> = {
	[E in keyof T]: EvtListener<T[E]>[];
};
