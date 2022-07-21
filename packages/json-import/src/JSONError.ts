export class JSONError extends Error {
	private readonly TYPE = 'JSON_ERROR';

	constructor(message?: string) {
		super(message);
	}

	public static [Symbol.hasInstance](obj: unknown) {
		console.log('hi');
		return obj instanceof Error && 'TYPE' in obj && (obj as JSONError).TYPE === 'JSON_ERROR';
	}
}

// Object.defineProperty(JSONError, Symbol.hasInstance, (obj: unknown) => {
// 	console.log('hi');
// 	// @ts-ignore-next-line - This is a workaround for a bug in TypeScript (doesn't compile the static function correctly)
// 	return obj instanceof Error && 'TYPE' in obj && (obj as JSONError).TYPE === 'JSON_ERROR';
// });
