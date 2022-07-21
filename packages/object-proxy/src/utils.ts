import { ChangeListener, JSONObject } from './types';

export function makeProxy<T extends JSONObject>(target: T, changeListener: ChangeListener): T {
	const set = <K extends string>(_: any, property: K, value: T[K]) => {
		if (typeof value === 'object' && value !== null) {
			const oldValue = target[property];
			target[property] = makeProxy(value as JSONObject, (propertyPath, newValue, oldValue) =>
				changeListener(`${property}.${propertyPath}`, newValue, oldValue)
			) as T[K];
			changeListener(property, value, oldValue);
		} else {
			const oldValue = target[property];
			target[property] = value;
			changeListener(property, value, oldValue);
		}
		return true;
	};

	const get = <K extends string>(_: any, property: K): T[K] => {
		return target[property];
	};

	for (const property in target) {
		if (typeof target[property] === 'object' && target[property] !== null) {
			target[property] = makeProxy(target[property] as JSONObject, (propertyPath, newValue, oldValue) =>
				changeListener(`${property}.${propertyPath}`, newValue, oldValue)
			) as T[typeof property];
		}
	}

	const proxy = new Proxy<T>(target as unknown as T, { get, set });

	return proxy;
}
