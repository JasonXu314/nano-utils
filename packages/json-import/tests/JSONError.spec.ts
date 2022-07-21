import { JSONError } from '../src/JSONError';

describe('JSON Error test suite', () => {
	it('Constructs properly', () => {
		let error = new JSONError('test');

		expect(error).toBeTruthy();
		expect(error.message).toBe('test');

		error = new JSONError();

		expect(error).toBeTruthy();
		expect(error.message).toBe('');
	});

	it('Can find its own instances', () => {
		const jsonError = new JSONError('test');
		const error = new Error('test 2');

		expect(jsonError instanceof Error).toBeTruthy();
		expect(jsonError instanceof JSONError).toBeTruthy();
		expect(error instanceof JSONError).toBeFalsy();
	});
});
