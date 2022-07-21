import { JSONObject, makeProxy } from '@nano-utils/object-proxy';
import { readFileSync, writeFileSync } from 'fs';
import { InferType, SchemaOf } from 'yup';
import { JSONError } from './JSONError';

export function importJSON<T extends JSONObject>(path: string, schema?: SchemaOf<T>): typeof schema extends SchemaOf<T> ? InferType<typeof schema> : any {
	const obj = JSON.parse(readFileSync(path).toString()) as T;

	if (schema && !schema.isValidSync(obj)) {
		throw new JSONError(`JSON file ${path} did not match schema`);
	}

	return makeProxy<T>(obj, () => {
		writeFileSync(path, JSON.stringify(obj, null, 4));
	});
}

export const requireJSON = importJSON;
