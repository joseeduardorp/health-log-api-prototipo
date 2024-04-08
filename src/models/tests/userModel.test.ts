import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	test,
} from '@jest/globals';

import UserModel from '../userModel';
import Database from '../../database';

import { AccountType, IInsertData } from '../types/userModel';

describe('Unit - User Model', () => {
	let db: Database;
	let userModel: UserModel;
	const defaultUserData: IInsertData = {
		name: 'default user',
		email: 'default.user@example.com',
		password: '12345',
	};

	beforeEach(async () => {
		db = new Database();
		await db.connect();

		userModel = new UserModel(db);
		await userModel.rawQuery('BEGIN TRANSACTION');
	});

	afterEach(async () => {
		await userModel.rawQuery('ROLLBACK TRANSACTION');
		await db.disconnect();
	});

	it('Should add a new user', async () => {
		const user = await userModel.addUser(defaultUserData);

		expect(user).toStrictEqual(
			expect.objectContaining({
				id: expect.any(Number),
				...defaultUserData,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			})
		);
	});

	it('Should find an user by email', async () => {
		await userModel.addUser(defaultUserData);

		const email = defaultUserData.email;
		const user = await userModel.findByEmail(email);

		expect(user).toStrictEqual(
			expect.objectContaining({
				id: expect.any(Number),
				...defaultUserData,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			})
		);
	});

	it('Should not find an user by email', async () => {
		const email = 'undefined.user@example.com';
		const user = await userModel.findByEmail(email);

		expect(user).toBeUndefined();
	});

	test.each(['patient', 'caregiver'] as AccountType[])(
		'Should add user to %s profile',
		async (accountType) => {
			const user = await userModel.addUser(defaultUserData);

			const profileIds = await userModel.addToProfile(user.id, accountType);

			expect(profileIds).toStrictEqual(
				expect.objectContaining({
					userId: user.id,
					[accountType + 'Id']: expect.any(Number),
				})
			);
		}
	);

	test.each(['patient', 'caregiver'] as AccountType[])(
		'Should find an %s profileId by userId',
		async (accountType) => {
			const user = await userModel.addUser(defaultUserData);
			await userModel.addToProfile(user.id, accountType);

			const ids = await userModel.findProfileById(user.id, accountType);

			expect(ids).toStrictEqual(
				expect.objectContaining({
					userId: user.id,
					[accountType + 'Id']: expect.any(Number),
				})
			);
		}
	);
});
