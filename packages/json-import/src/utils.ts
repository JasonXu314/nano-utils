import { JSONObject, JSONValue } from '@nano-utils/object-proxy';
import { JSONError } from './JSONError';
import { Arr, Obj, ObjectModel, Type } from './typings';

export function validate(obj: JSONValue, template: Type): void {
	if (template.__TYPE === 'array') {
		if (!Array.isArray(obj)) {
			throw new JSONError('Template object property "<PROP_KEY>" is of type array, but actual was not');
		} else {
			const templateObj = (template as Arr<Type>).elemType;

			for (const elem of obj) {
				validate(elem, templateObj);
			}
		}
	} else if (template.__TYPE !== 'object') {
		if (typeof obj !== template.__TYPE) {
			if (obj === null && template.__TYPE !== 'null') {
				throw new JSONError('Template object property "<PROP_KEY>" is null but actual was not');
			}
			throw new JSONError('Template object property "<PROP_KEY>" does not match actual object');
		}
	} else {
		for (const key in (template as Obj<ObjectModel<JSONObject>>).model) {
			if (!(key in (obj as JSONObject))) {
				throw new JSONError(`Template object property ${key} missing in actual object`);
			}
			try {
				validate((obj as JSONObject)[key], (template as Obj<ObjectModel<JSONObject>>).model[key]);
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
