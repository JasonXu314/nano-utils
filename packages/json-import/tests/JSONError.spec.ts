import { JSONError } from '../dist/JSONError';

describe('JSON Error test suite', () => {
	it('Constructs properly', () => {
		const error = new JSONError('test');

		expect(error).toBeTruthy();
		expect(error.message).toBe('test');
	});

	it('Can find its own instances', () => {
		const jsonError = new JSONError('test');
		const error = new Error('test 2');

		expect(jsonError instanceof Error).toBeTruthy();
		expect(jsonError instanceof JSONError).toBeTruthy();
		expect(error instanceof JSONError).toBeFalsy();
	});
});
