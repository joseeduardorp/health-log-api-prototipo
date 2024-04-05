import {
	afterAll,
	beforeAll,
	describe,
	expect,
	jest,
	test,
} from '@jest/globals';

import service from '../../../src/features/signUp/signUpService';

import UserModel from '../../../src/models/userModel';
import { AccountType } from '../../../src/models/types/userModel';

describe('SignUpService', () => {
	let userModel: UserModel;

	beforeAll(() => {
		userModel = new UserModel();
	});

	afterAll(async () => {
		await userModel.disconnect();
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
				id: '1',
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
					userId: expect.any(String),
					profileId: expect.any(String),
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
				id: '1',
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
					userId: expect.any(String),
					profileId: expect.any(String),
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
				id: '1',
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
