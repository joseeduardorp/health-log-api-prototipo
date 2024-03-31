import { afterEach, describe, expect, jest, test } from '@jest/globals';

import UserService from '../../../services/userService';

import db from '../../../database';

import { IBody as IUserData } from '../../../types/createUser';
import { TAccountType } from '../../../types/user';
import { IUserInsertData, IUserResult } from '../../../types/database';

function createUserProfile(profileType: TAccountType): IUserData {
	return {
		name: 'Default User',
		email: 'default.user@test.com',
		password: '12345',
		accountType: profileType,
	};
}

function createUser(userData: IUserData): IUserResult {
	return {
		id: '1',
		name: userData.name,
		email: userData.email,
		password: userData.password,
		createdAt: '2024-31-03',
		updatedAt: '2024-31-03',
	};
}

function mockFindByEmailResult(user?: IUserResult) {
	db.findUserByEmail = jest
		.fn<() => Promise<IUserResult | undefined>>()
		.mockImplementation(() => {
			if (user) {
				return Promise.resolve(user);
			}

			return Promise.resolve(undefined);
		});
}

function mockFindProfileId(profileType?: TAccountType) {
	db.findUserProfileId = jest
		.fn<() => Promise<any>>()
		.mockImplementation(() => {
			if (profileType) {
				return Promise.resolve({
					[profileType + 'Id']: '1',
					userId: '1',
				});
			}

			return Promise.resolve(undefined);
		});
}

function mockAddToProfile() {
	db.addUserToProfile = jest.fn<() => Promise<void>>().mockResolvedValue();
}

function mockAddUserResult({ name, email, password }: IUserInsertData) {
	db.addUser = jest.fn<() => Promise<IUserResult>>().mockResolvedValue({
		id: '1',
		name,
		email,
		password,
		createdAt: '2024-31-03',
		updatedAt: '2024-31-03',
	});
}

describe('UserService', () => {
	let defaultUser: IUserData;
	let defaultUserResult: IUserResult;

	afterEach(() => {
		defaultUser = {} as IUserData;
		defaultUserResult = {} as IUserResult;
		jest.clearAllMocks();
	});

	describe('createUser', () => {
		test.each(['patient', 'caregiver'] as TAccountType[])(
			'Should throw an error 409 when user already registered with profile type %s',
			async (profileType) => {
				// arrange
				defaultUser = createUserProfile(profileType);
				defaultUserResult = createUser(defaultUser);

				mockFindByEmailResult(defaultUserResult);
				mockFindProfileId(profileType);

				// act
				await UserService.createUser(defaultUser)
					// assert
					.then((value) => {
						expect(value).toBeUndefined();
					})
					.catch((err) => {
						expect(err).toHaveProperty(
							'message',
							'You already have an account like ' + profileType
						);
						expect(err).toHaveProperty('statusCode', 409);
					});
			}
		);

		test.each(['patient', 'caregiver'] as TAccountType[])(
			'Should add a user to profile type %s',
			async (profileType) => {
				defaultUser = createUserProfile(profileType);
				defaultUserResult = createUser(defaultUser);

				mockFindByEmailResult(defaultUserResult);
				mockFindProfileId();
				mockAddToProfile();

				// act
				const user = await UserService.createUser(defaultUser);

				// assert
				expect(user).toStrictEqual(
					expect.objectContaining({
						id: defaultUserResult.id,
						name: defaultUserResult.name,
						email: defaultUserResult.email,
						accountType: profileType,
					})
				);
			}
		);

		test.each(['patient', 'caregiver'] as TAccountType[])(
			'Should create a new %s type user',
			async (profileType) => {
				// arrange
				defaultUser = createUserProfile(profileType);
				defaultUserResult = createUser(defaultUser);

				mockFindByEmailResult();
				mockAddToProfile();
				mockAddUserResult({
					name: defaultUserResult.name,
					email: defaultUserResult.email,
					password: defaultUser.password,
				});

				// act
				const user = await UserService.createUser({
					name: defaultUserResult.name,
					email: defaultUserResult.email,
					password: defaultUser.password,
					accountType: profileType,
				});

				// assert
				expect(user).toStrictEqual(
					expect.objectContaining({
						id: defaultUserResult.id,
						name: defaultUserResult.name,
						email: defaultUserResult.email,
						accountType: profileType,
					})
				);
			}
		);
	});
});
