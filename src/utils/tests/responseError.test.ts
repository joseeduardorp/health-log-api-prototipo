import { describe, it, expect } from '@jest/globals';
import { ResponseError } from '../responseError';

describe('Unit - Response Error', () => {
	it('Create a new ResponseError with passed parameters', () => {
		const error = new ResponseError(600, 'Custom status code error');

		expect(error).toBeInstanceOf(Error);
		expect(error.statusCode).toBe(600);
		expect(error.message).toBe('Custom status code error');
	});
});
