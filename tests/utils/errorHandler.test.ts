import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';

import { errorHandler } from '../../src/utils/errorHandler';
import { ResponseError } from '../../src/utils/responseError';

describe('ErrorHandler', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: jest.Mock<NextFunction>;
	let errorMessage: string;

	beforeEach(() => {
		req = {};
		res = {
			status: jest.fn<(code: number) => Response>().mockReturnThis(),
			json: jest.fn<(message: string) => Response>(),
		};
		next = jest.fn();
	});

	it('Should return a customized status code error', async () => {
		errorMessage = 'Custom error response';
		const error = new ResponseError(600, errorMessage);

		errorHandler(
			error,
			req as Request,
			res as Response,
			next as unknown as NextFunction
		);

		expect(res.status).toHaveBeenCalledWith(600);
		expect(res.json).toHaveBeenCalledWith({
			status: 'error',
			message: errorMessage,
		});
	});

	it('Should return a 500 error', async () => {
		errorMessage = 'Default error response';
		const error = new Error(errorMessage);

		errorHandler(
			error,
			req as Request,
			res as Response,
			next as unknown as NextFunction
		);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			status: 'error',
			message: errorMessage,
		});
	});
});
