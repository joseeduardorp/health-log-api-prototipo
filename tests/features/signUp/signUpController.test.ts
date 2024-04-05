import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	jest,
	test,
} from '@jest/globals';
import { NextFunction, Request, Response } from 'express';

import controller from '../../../src/features/signUp/signUpController';
import service from '../../../src/features/signUp/signUpService';

import { IBody } from '../../../src/features/signUp/types';
import { AccountType } from '../../../src/models/types/userModel';

import { ResponseError } from '../../../src/utils/responseError';

describe('SignUpController', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next = jest.fn<NextFunction>();

	beforeEach(() => {
		req = { body: {} };
		res = {
			status: jest.fn<(code: number) => Response>().mockReturnThis(),
			json: jest.fn<(body?: any) => Response>().mockReturnThis(),
		};
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test.each(['patient', 'caregiver'] as AccountType[])(
		'Should create a new %s user',
		async (accountType) => {
			// arrange
			const bodyData: IBody = {
				name: `New ${accountType}`,
				email: `${accountType}.user@example.com`,
				password: '12345',
				accountType,
			};
			req.body = bodyData;

			const user = {
				userId: '1',
				profileId: '1',
				name: bodyData.name,
				email: bodyData.email,
				accountType,
			};
			jest.spyOn(service, 'execute').mockResolvedValue(user);

			// act
			await controller.handler(
				req as Request,
				res as Response,
				next as unknown as NextFunction
			);

			// assert
			expect(res.json).toHaveBeenCalledWith({
				status: 'success',
				user,
			});
		}
	);

	it('Should throw a 400 error when send body without data', async () => {
		// arrange
		req.body = {};

		// act
		await controller.handler(
			req as Request,
			res as Response,
			next as unknown as NextFunction
		);

		// assert
		expect(next).toHaveBeenCalledWith(
			new ResponseError(400, 'Invalid request!')
		);
	});

	it('Should throw a 400 error when accountType property is different from "patient" and "caregiver"', async () => {
		// arrange
		const bodyData = {
			name: 'User',
			email: 'user@example.com',
			password: '12345',
			accountType: 'other',
		};
		req.body = bodyData;

		// act
		await controller.handler(
			req as Request,
			res as Response,
			next as unknown as NextFunction
		);

		// assert
		expect(next).toHaveBeenCalledWith(
			new ResponseError(400, 'Invalid request!')
		);
	});
});
