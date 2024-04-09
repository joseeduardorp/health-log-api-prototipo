import { afterAll, beforeAll, describe, expect, it, test } from '@jest/globals';
import request from 'supertest';
import { Server } from 'http';

import app from '../../src/app';
import UserModel from '../../src/models/userModel';
import Database from '../../src/database';

import { AccountType } from '../../src/models/types/userModel';

describe('Integration - Login Route', () => {
	let server: Server;
	let db: Database;
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

		db = new Database();
		await db.connect();

		userModel = new UserModel(db);

		await addDefaultUsers();
	});

	afterAll(async () => {
		await userModel.rawQuery('truncate table "Users" cascade');
		await db.disconnect();
		server.close();
	});

	test.each(['patient', 'caregiver'] as AccountType[])(
		'Should login as %s user',
		async (accountType) => {
			const user =
				accountType === 'patient' ? defaultPatientUser : defaultCaregiverUser;

			const res = await request(server).post('/login').send({
				email: user.email,
				password: user.password,
				accountType,
			});

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('status', 'success');
			expect(res.body).toHaveProperty('user', {
				userId: expect.any(Number),
				profileId: expect.any(Number),
				accountType,
			});
		}
	);

	it('Should return a 400 error when body data is missing', async () => {
		const userData = {
			email: '',
			password: '',
			accountType: '',
		};

		const res = await request(app).post('/login').send(userData);

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

		const res = await request(app).post('/login').send(userData);

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty('status', 'error');
		expect(res.body).toHaveProperty('message', 'Invalid request!');
	});

	it('Should return a 400 error when email does not exist', async () => {
		const userData = {
			email: 'unknown.user@example.com',
			password: '12345',
			accountType: 'patient',
		};

		const res = await request(app).post('/login').send(userData);

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty('status', 'error');
		expect(res.body).toHaveProperty('message', 'Incorrect credentials!');
	});

	it('Should return a 400 error when password is incorrect', async () => {
		const userData = {
			email: defaultPatientUser.email,
			password: 'wrongpass',
			accountType: 'patient',
		};

		const res = await request(app).post('/login').send(userData);

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty('status', 'error');
		expect(res.body).toHaveProperty('message', 'Incorrect credentials!');
	});

	it('Should return a 400 error when user does not have the indicated profile', async () => {
		const userData = {
			email: defaultPatientUser.email,
			password: defaultPatientUser.password,
			accountType: 'caregiver',
		};

		const res = await request(app).post('/login').send(userData);

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty('status', 'error');
		expect(res.body).toHaveProperty('message', 'Incorrect credentials!');
	});
});
