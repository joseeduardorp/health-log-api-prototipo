import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';

import db from '../../database';

import { IUserInsertData } from '../../types/database';

describe('Database Integration', () => {
	beforeAll((done) => {
		db.truncate('Users').then(() => done());
	});

	afterAll((done) => {
		db.truncate('Users').then(() => {
			db.disconnect().then(() => done());
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
		expect(user).toHaveProperty('email');
		expect(user.email).toBe(email);

		findByEmail.mockClear();
	});
});
