import {
	describe,
	it,
	jest,
	beforeEach,
	expect,
	afterEach,
	test,
} from '@jest/globals';
import { Request, Response, NextFunction } from 'express';

import UserController from '../../../controllers/userController';
import UserService from '../../../services/userService';

import { ResponseError } from '../../../utils/responseError';

import { IBody as IUserData, INewUser } from '../../../types/createUser';
import { TAccountType } from '../../../types/user';

function createUserProfile(profileType: TAccountType): IUserData {
	return {
		name: 'Default User',
		email: 'default.user@test.com',
		password: '12345',
		accountType: profileType,
	};
}

function mockUserServiceResult(user: INewUser) {
	UserService.createUser = jest
		.fn<(user: IUserData) => Promise<INewUser>>()
		.mockResolvedValue(user);
}

describe('UserController', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next = jest.fn<NextFunction>();
	let defaultUser: IUserData;

	beforeEach(() => {
		req = { body: {} };
		res = {
			status: jest.fn<(code: number) => Response>().mockReturnThis(),
			json: jest.fn<(body?: any) => Response>(),
		};
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('createUser', () => {
		test.each(['patient', 'caregiver'] as TAccountType[])(
			'Should create a new %s user with body data',
			async (profileType) => {
				// arrange
				defaultUser = createUserProfile(profileType);
				req.body = defaultUser;

				const newUser: INewUser = {
					id: '1',
					name: defaultUser.name,
					email: defaultUser.email,
					accountType: defaultUser.accountType,
				};
				mockUserServiceResult(newUser);

				// act
				await UserController.createUser(
					req as Request,
					res as Response,
					next as unknown as NextFunction
				);

				// assert
				expect(res.json).toHaveBeenCalledWith({
					status: 'success',
					user: newUser,
				});
			}
		);

		it('Should throw a 400 error when body data is missing', async () => {
			// arrange
			req.body = {};

			// act
			await UserController.createUser(
				req as Request,
				res as Response,
				next as unknown as NextFunction
			);

			// assert
			expect(next).toHaveBeenCalledWith(
				new ResponseError(400, 'Invalid request!')
			);
		});

		it('Should throw a 400 error when accountType property is different from "patient" or "caregiver"', async () => {
			// arrange
			defaultUser = {
				name: 'Default User',
				email: 'default.user@test.com',
				password: '12345',
				accountType: 'other' as TAccountType,
			};
			req.body = defaultUser;

			// act
			await UserController.createUser(
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
});
