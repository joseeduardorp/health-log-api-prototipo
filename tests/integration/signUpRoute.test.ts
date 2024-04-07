import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	test,
} from '@jest/globals';
import request from 'supertest';
import { Server } from 'http';

import app from '../../src/app';
import UserModel from '../../src/models/userModel';

import { AccountType } from '../../src/models/types/userModel';
import { IBody } from '../../src/features/signUp/types';

describe('Integration - SignUp Route', () => {
	let server: Server;
	let userModel: UserModel;
	const defaultPatientUser = {
		name: 'Default Patient User',
		email: 'default.patientuser@example.com',
		password: '12345',
	};
	const defaultCaregiverUser = {
		name: 'Default Caregiver User',
		email: 'default.caregiveruser@example.com',
		password: '12345',
	};

	async function addDefaultUsers() {
		const patientData = await userModel.addUser(defaultPatientUser);
		const caregiverData = await userModel.addUser(defaultCaregiverUser);
		await userModel.addToProfile(patientData.id, 'patient');
		await userModel.addToProfile(caregiverData.id, 'caregiver');
	}

	beforeAll(async () => {
		server = app.listen(3000);
		userModel = new UserModel();
	});

	afterEach(async () => {
		await userModel.client.raw('truncate table "Users" cascade');
	});

	afterAll(async () => {
		await userModel.disconnect();
		server.close();
	});

	test.each(['patient', 'caregiver'] as AccountType[])(
		'Should register a new %s user',
		async (accountType) => {
			const userData: IBody = {
				name: `${accountType} user`,
				email: `${accountType}.user@example.com`,
				password: '12345',
				accountType,
			};

			const res = await request(server).post('/signup').send(userData);

			expect(res.statusCode).toEqual(201);
			expect(res.body).toHaveProperty('status', 'success');
			expect(res.body).toHaveProperty('user', {
				userId: expect.any(Number),
				profileId: expect.any(Number),
				name: userData.name,
				email: userData.email,
				accountType: userData.accountType,
			});
		}
	);

	it('Should return a 400 error when body data is missing', async () => {
		const userData = {
			name: '',
			email: '',
			password: '',
			accountType: '',
		};

		const res = await request(app).post('/signup').send(userData);

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty('status', 'error');
		expect(res.body).toHaveProperty('message', 'Invalid request!');
	});

	it('Should return a 400 error when accountType property is different from "patient" or "caregiver"', async () => {
		const userData = {
			name: 'other user',
			email: 'other.user@example.com',
			password: '12345',
			accountType: 'other',
		};

		const res = await request(app).post('/signup').send(userData);

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty('status', 'error');
		expect(res.body).toHaveProperty('message', 'Invalid request!');
	});

	test.each(['patient', 'caregiver'] as AccountType[])(
		'Should create a new %s profile for an existing user',
		async (accountType) => {
			await addDefaultUsers();

			const existingUser =
				accountType === 'patient' ? defaultCaregiverUser : defaultPatientUser;

			const userData = {
				...existingUser,
				accountType,
			};

			const res = await request(app).post('/signup').send(userData);

			expect(res.statusCode).toBe(201);
			expect(res.body).toHaveProperty('status', 'success');
			expect(res.body).toHaveProperty('user', {
				userId: expect.any(Number),
				profileId: expect.any(Number),
				name: userData.name,
				email: userData.email,
				accountType: userData.accountType,
			});
		}
	);

	test.each(['patient', 'caregiver'] as AccountType[])(
		'Should return a 409 error when user already registered with profile type %s',
		async (accountType) => {
			await addDefaultUsers();

			const existingUser =
				accountType === 'patient' ? defaultPatientUser : defaultCaregiverUser;

			const userData = {
				...existingUser,
				accountType,
			};

			const res = await request(app).post('/signup').send(userData);

			expect(res.statusCode).toBe(409);
			expect(res.body).toHaveProperty('status', 'error');
			expect(res.body).toHaveProperty(
				'message',
				'You already have an account like ' + accountType
			);
		}
	);
});
