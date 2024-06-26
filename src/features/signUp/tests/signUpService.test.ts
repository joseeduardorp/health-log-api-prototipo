import {
	afterAll,
	beforeAll,
	describe,
	expect,
	jest,
	test,
} from '@jest/globals';

import service from '../signUpService';

import Database from '../../../database';
import UserModel from '../../../models/userModel';

import { AccountType } from '../../../models/types/userModel';

describe('Unit - SignUp Service', () => {
	let db: Database;
	let userModel: UserModel;

	beforeAll(async () => {
		db = new Database();
		await db.connect();

		userModel = new UserModel(db);
	});

	afterAll(async () => {
		await db.disconnect();
		jest.restoreAllMocks();
	});

	test.each(['patient', 'caregiver'] as AccountType[])(
		'Should create new %s user',
		async (accountType) => {
			// arrange
			const userData = {
				name: `New ${accountType}`,
				email: `${accountType}.user@example.com`,
				password: '12345',
				accountType,
			};

			jest
				.spyOn(UserModel.prototype, 'findByEmail')
				.mockResolvedValue(undefined);
			jest.spyOn(UserModel.prototype, 'addUser').mockResolvedValue({
				id: 1,
				name: userData.name,
				email: userData.email,
				password: userData.password,
				createdAt: '2024-04-03',
				updatedAt: '2024-04-03',
			});
			jest.spyOn(UserModel.prototype, 'addToProfile').mockResolvedValue({
				userId: '1',
				[accountType + 'Id']: '1',
			});

			// act
			const newUser = await service.execute(userData);

			// assert
			expect(newUser).toStrictEqual(
				expect.objectContaining({
					userId: expect.any(Number),
					profileId: expect.any(Number),
					name: userData.name,
					email: userData.email,
					accountType,
				})
			);
		}
	);

	test.each(['patient', 'caregiver'] as AccountType[])(
		'Should create a new %s profile for an existing user',
		async (accountType) => {
			// arrange
			const existingUserData = {
				id: 1,
				name: `${accountType} user`,
				email: `${accountType}.user@example.com`,
				password: '12345',
				createdAt: '2024-04-03',
				updatedAt: '2024-04-03',
			};

			jest
				.spyOn(UserModel.prototype, 'findByEmail')
				.mockResolvedValue(existingUserData);
			jest
				.spyOn(UserModel.prototype, 'findProfileById')
				.mockResolvedValue(undefined);
			jest.spyOn(UserModel.prototype, 'addToProfile').mockResolvedValue({
				userId: '1',
				[accountType + 'Id']: '1',
			});

			// act
			const newUserProfile = {
				name: existingUserData.name,
				email: existingUserData.email,
				password: existingUserData.password,
				accountType,
			};
			const user = await service.execute(newUserProfile);

			// assert
			expect(user).toStrictEqual(
				expect.objectContaining({
					userId: expect.any(Number),
					profileId: expect.any(Number),
					name: newUserProfile.name,
					email: newUserProfile.email,
					accountType: newUserProfile.accountType,
				})
			);
		}
	);

	test.each(['patient', 'caregiver'] as AccountType[])(
		'Should throw an error 409 when user already registered with profile type %s',
		async (accountType) => {
			// arrange
			const existingUserData = {
				id: 1,
				name: `Existing ${accountType} user`,
				email: `${accountType}.user@example.com`,
				password: '12345',
				createdAt: '2024-04-03',
				updatedAt: '2024-04-03',
			};

			jest.spyOn(userModel, 'findByEmail').mockResolvedValue(existingUserData);
			jest.spyOn(userModel, 'findProfileById').mockResolvedValue({
				userId: '1',
				[accountType + 'Id']: '1',
			});

			return (
				service
					// act
					.execute({
						name: existingUserData.name,
						email: existingUserData.email,
						password: existingUserData.password,
						accountType,
					})
					// assert
					.catch((error) => {
						expect(error).toHaveProperty('statusCode', 409);
						expect(error).toHaveProperty(
							'message',
							`You already have an account like ${accountType}`
						);
					})
			);
		}
	);
});
