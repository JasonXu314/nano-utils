import { JSONObject } from '@nano-utils/object-proxy';

export interface Type {
	readonly __TYPE: string;
}

export class String implements Type {
	public readonly __TYPE = 'string';
}

export class Number implements Type {
	public readonly __TYPE = 'number';
}

export class Boolean implements Type {
	public readonly __TYPE = 'boolean';
}

export class Null implements Type {
	public readonly __TYPE = 'null';
}

export class Arr<T extends Type> implements Type {
	public readonly __TYPE = 'array';
	public readonly elemType: T;

	constructor(elem: T) {
		this.elemType = elem;
	}
}

export class Obj<T> implements Type {
	public readonly __TYPE = 'object';

	constructor(public readonly model: T) {}
}

export type ObjectModel<T> = {
	[K in keyof T]: T[K] extends string
		? String
		: T[K] extends number
		? Number
		: T[K] extends boolean
		? Boolean
		: T[K] extends null
		? Null
		: Obj<ObjectModel<T[K]>>;
};

export class Types {
	public static readonly STRING = new String();
	public static readonly NUMBER = new Number();
	public static readonly BOOLEAN = new Boolean();
	public static readonly NULL = new Null();

	public static ARRAY<T extends Type>(elem: T): Arr<T> {
		return new Arr<T>(elem);
	}

	public static OBJECT<T extends JSONObject>(model: ObjectModel<T>): Obj<ObjectModel<T>> {
		return new Obj<ObjectModel<T>>(model);
	}
}
