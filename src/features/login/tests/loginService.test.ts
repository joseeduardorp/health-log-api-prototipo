import { afterEach, describe, expect, it, jest, test } from '@jest/globals';

import service from '../loginService';

import UserModel from '../../../models/userModel';

import { AccountType, IUser } from '../../../models/types/userModel';
import { IBody } from '../types';

describe('Unit - Login Service', () => {
	afterEach(async () => {
		jest.restoreAllMocks();
	});

	test.each(['patient', 'caregiver'] as AccountType[])(
		'Should return %s user data',
		async (accountType) => {
			// arrange
			const userData = {
				email: `${accountType}.user@example.com`,
				password: '12345',
				accountType,
			};
			const userResultData: IUser = {
				id: 1,
				name: `${accountType} user`,
				email: userData.email,
				password: userData.password,
				createdAt: '2024-04-09',
				updatedAt: '2024-04-09',
			};

			jest
				.spyOn(UserModel.prototype, 'findByEmail')
				.mockResolvedValue(userResultData);
			jest.spyOn(UserModel.prototype, 'findProfileById').mockResolvedValue({
				userId: userResultData.id,
				[accountType + 'Id']: 1,
			});

			// act
			const user = await service.execute(userData);

			// assert
			expect(user).toStrictEqual(
				expect.objectContaining({
					userId: expect.any(Number),
					profileId: expect.any(Number),
					accountType,
				})
			);
		}
	);

	it('Should throw an error 400 if email is incorrect', async () => {
		// arrange
		const userData: IBody = {
			email: `unknown.email@example.com`,
			password: '12345',
			accountType: 'patient',
		};

		jest.spyOn(UserModel.prototype, 'findByEmail').mockResolvedValue(undefined);

		try {
			// act
			await service.execute(userData);
		} catch (error) {
			// assert
			expect(error).toHaveProperty('statusCode', 400);
			expect(error).toHaveProperty('message', 'Incorrect credentials!');
		}
	});

	it('Should throw an error 400 if password is incorrect', async () => {
		// arrange
		const userData: IBody = {
			email: `default.user@example.com`,
			password: 'wrongpass',
			accountType: 'patient',
		};
		const userResultData: IUser = {
			id: 1,
			name: 'default user',
			email: userData.email,
			password: '12345',
			createdAt: '2024-04-09',
			updatedAt: '2024-04-09',
		};

		jest
			.spyOn(UserModel.prototype, 'findByEmail')
			.mockResolvedValue(userResultData);

		try {
			// act
			await service.execute(userData);
		} catch (error) {
			// assert
			expect(error).toHaveProperty('statusCode', 400);
			expect(error).toHaveProperty('message', 'Incorrect credentials!');
		}
	});

	it('Should throw an error 400 if user does not have the indicated profile', async () => {
		// arrange
		const userData: IBody = {
			email: `default.user@example.com`,
			password: '12345',
			accountType: 'patient',
		};
		const userResultData: IUser = {
			id: 1,
			name: 'default user',
			email: userData.email,
			password: userData.password,
			createdAt: '2024-04-09',
			updatedAt: '2024-04-09',
		};

		jest
			.spyOn(UserModel.prototype, 'findByEmail')
			.mockResolvedValue(userResultData);
		jest
			.spyOn(UserModel.prototype, 'findProfileById')
			.mockResolvedValue(undefined);

		try {
			// act
			await service.execute(userData);
		} catch (error) {
			// assert
			expect(error).toHaveProperty('statusCode', 400);
			expect(error).toHaveProperty('message', 'Incorrect credentials!');
		}
	});
});
