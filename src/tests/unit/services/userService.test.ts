import { afterAll, describe, expect, it } from '@jest/globals';

import UserService from '../../../services/userService';
import { IBody as IUserData } from '../../../types/createUser';

import db from '../../../database';

describe.skip('UserService', () => {
	afterAll((done) => {
		db.truncate('Users').then(() => {
			db.disconnect().then(() => done());
		});
	});

	it('Should add a new patient user', async () => {
		const userData: IUserData = {
			name: 'patient user',
			email: 'patient@example.com',
			password: '12345',
			accountType: 'patient',
		};

		const newUser = await UserService.createUser(userData);

		expect(newUser).toHaveProperty('id');
		expect(newUser.id).toBeTruthy();
		expect(newUser).toHaveProperty('name', userData.name);
		expect(newUser).toHaveProperty('email', userData.email);
		expect(newUser).toHaveProperty('accountType', userData.accountType);
	});

	it('Should add a new caregiver user', async () => {
		const userData: IUserData = {
			name: 'caregiver user',
			email: 'caregiver@example.com',
			password: '12345',
			accountType: 'caregiver',
		};
		const newUser = await UserService.createUser(userData);
		expect(newUser).toHaveProperty('id');
		expect(newUser.id).toBeTruthy();
		expect(newUser).toHaveProperty('name', userData.name);
		expect(newUser).toHaveProperty('email', userData.email);
		expect(newUser).toHaveProperty('accountType', userData.accountType);
	});

	it('Should check if email is already registered', async () => {});

	it('Should check which user profile type(patient/caregiver) is registered', async () => {});

	it('Should throw an error if user tries to register for the same profile type', async () => {});
});
