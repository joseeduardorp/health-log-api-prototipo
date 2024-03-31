import {
	describe,
	it,
	expect,
	jest,
	afterAll,
	beforeEach,
} from '@jest/globals';

import db from '../../database';

import { IUserInsertData } from '../../types/database';

describe.skip('Database', () => {
	beforeEach(async () => {
		await db.truncate('Users');
		await db.truncate('Patients');
	});

	afterAll((done) => {
		db.disconnect().then(() => {
			done();
		});
	});

	it('Should add and return a new user to the database', async () => {
		const addUserSpy = jest.spyOn(db, 'addUser');

		const user: IUserInsertData = {
			name: 'John Doe',
			email: 'john@example.com',
			password: '12345',
		};
		const addedUser = await db.addUser(user);

		expect(addUserSpy).toBeCalledWith(user);
		expect(addedUser).toHaveProperty('name', user.name);
		expect(addedUser).toHaveProperty('email', user.email);
		expect(addedUser).toHaveProperty('password', user.password);

		addUserSpy.mockClear();
	});

	it('Should find a user by email', async () => {
		const newUser: IUserInsertData = {
			name: 'Jane Doe',
			email: 'jane@example.com',
			password: '12345',
		};
		await db.addUser(newUser);

		const findByEmail = jest.spyOn(db, 'findUserByEmail');

		const email = newUser.email;
		const user = await db.findUserByEmail(email);

		expect(findByEmail).toBeCalledWith(email);
		expect(user).not.toBeUndefined();
		expect(user).toHaveProperty('email', email);

		findByEmail.mockClear();
	});

	it('Should add an user to Patients tables', async () => {
		const addToProfileSpy = jest.spyOn(db, 'addUserToProfile');

		const newUser: IUserInsertData = {
			name: 'Jonh Doe',
			email: 'jonh@example.com',
			password: '12345',
		};

		const user = await db.addUser(newUser);
		const profileIds = await db.addUserToProfile('Patients', user.id);

		expect(addToProfileSpy).toBeCalledWith('Patients', user.id);
		expect(profileIds).toHaveProperty('patientId');
		expect(profileIds).toHaveProperty('userId', user.id);
	});

	it('Should add an user to Caregivers tables', async () => {
		const addToProfileSpy = jest.spyOn(db, 'addUserToProfile');

		const newUser: IUserInsertData = {
			name: 'Jane Doe',
			email: 'jane@example.com',
			password: '12345',
		};

		const user = await db.addUser(newUser);
		const profileIds = await db.addUserToProfile('Caregivers', user.id);

		expect(addToProfileSpy).toBeCalledWith('Caregivers', user.id);
		expect(profileIds).toHaveProperty('caregiverId');
		expect(profileIds).toHaveProperty('userId', user.id);
	});

	it('Should find a caregiverId by userId', async () => {
		const newUser: IUserInsertData = {
			name: 'Jane Doe',
			email: 'jane@example.com',
			password: '12345',
		};
		const user = await db.addUser(newUser);
		await db.addUserToProfile('Caregivers', user.id);

		const ids = await db.findUserProfileId('Caregivers', user.id);

		expect(ids).toBeTruthy();
		expect(ids).toHaveProperty('caregiverId');
	});

	it('Should find a patientId by userId', async () => {
		const newUser: IUserInsertData = {
			name: 'John Doe',
			email: 'john@example.com',
			password: '12345',
		};
		const user = await db.addUser(newUser);
		await db.addUserToProfile('Patients', user.id);

		const ids = await db.findUserProfileId('Patients', user.id);

		expect(ids).toBeTruthy();
		expect(ids).toHaveProperty('patientId');
	});
});
