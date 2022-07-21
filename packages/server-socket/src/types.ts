export type SocketMsg<T extends string | number | symbol> = {
	type: T;
};
