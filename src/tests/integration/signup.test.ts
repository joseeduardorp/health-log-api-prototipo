import { afterAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';

import db from '../../database';
import app from '../../app';

describe('Signup Route', () => {
	afterAll(async () => {
		await db.truncate('Users');
		await db.truncate('Patients');
		await db.truncate('Caregivers');
		await db.disconnect();
	});

	it('Sign up new patient user', async () => {
		// arrange
		const user = {
			name: 'New Patient User',
			email: 'new.patientuser@example.com',
			password: '12345',
			accountType: 'patient',
		};

		// act
		const res = await request(app).post('/signup').send(user);

		// assert
		expect(res.statusCode).toBe(201);
		expect(res.body).toStrictEqual(
			expect.objectContaining({
				status: 'success',
				user: {
					id: expect.any(Number),
					name: user.name,
					email: user.email,
					accountType: user.accountType,
				},
			})
		);
	});
});
