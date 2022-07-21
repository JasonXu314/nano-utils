import { JSONObject, makeProxy } from '@nano-utils/object-proxy';
import { readFileSync, writeFileSync } from 'fs';
import { JSONError } from './JSONError';
import { Arr, Obj, ObjectModel, Type } from './typings';
import { validate } from './utils';

export function importJSON<T extends JSONObject>(path: string, template?: Type): T {
	const obj = JSON.parse(readFileSync(path).toString()) as T;

	if (template) {
		if (template.__TYPE !== typeof obj && !(typeof obj === 'object' && template.__TYPE === 'array')) {
			throw new JSONError('Type of template object does not match JSON from file');
		}
		if (obj === null) {
			throw new JSONError('Read null from JSON file');
		}
		if (template === null) {
			throw new JSONError('Template cannot be null');
		}

		if (template.__TYPE === 'array') {
			if (!Array.isArray(obj)) {
				throw new JSONError('Template object is of type array, but JSON from file was not');
			} else {
				const templateObj = (template as Arr<Type>).elemType;

				obj.forEach((elem, i) => {
					try {
						validate(elem, templateObj);
					} catch (err: unknown) {
						if (err instanceof JSONError) {
							throw new JSONError(`JSON element ${i} did not match template type: ${err.message}`);
						} else {
							throw err;
						}
					}
				});
			}
		} else {
			for (const key in (template as Obj<ObjectModel<JSONObject>>).model) {
				if (!(key in obj)) {
					throw new JSONError(`Template object property "${key}" missing in actual object`);
				}
				try {
					validate(obj[key], (template as Obj<ObjectModel<JSONObject>>).model[key]);
				} catch (err: unknown) {
					if (err instanceof JSONError) {
						err.message.replace('<PROP_KEY>', key);
						throw err;
					} else {
						throw err;
					}
				}
			}
		}
	}

	return makeProxy<T>(obj, () => {
		writeFileSync(path, JSON.stringify(obj, null, 4));
	});
}

export { Types } from './typings';
export { validate };
export const requireJSON = importJSON;
