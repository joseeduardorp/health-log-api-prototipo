import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

import app from '../app';
import db from '../database';

function genRandomString() {
	return Math.random().toString(32).substring(2, 12);
}

const DEFAULT_USER = {
	name: 'default sign user',
	email: 'sign.user@email.com',
	password: 'defaultpasswd',
};
const DEFAULT_PATIENT = {
	name: genRandomString(),
	email: genRandomString() + '@email.com',
	password: genRandomString(),
};
const DEFAULT_CAREGIVER = {
	name: genRandomString(),
	email: genRandomString() + '@email.com',
	password: genRandomString(),
};

describe.only('Cadastro do usuário', () => {
	beforeAll((done) => {
		db.insert('Users', {
			columns: ['name', 'email', 'password'],
			values: [DEFAULT_USER.name, DEFAULT_USER.email, DEFAULT_USER.password],
		});

		done();
	});

	afterAll((done) => {
		db.disconnect().then(() => done());
	});

	it('Deve cadastrar um novo usuário do tipo "patient"', async () => {
		const res = await request(app).post('/signup').send({
			accountType: 'patient',
			name: DEFAULT_PATIENT.name,
			email: DEFAULT_PATIENT.email,
			password: DEFAULT_PATIENT.password,
		});

		expect(res.statusCode).toEqual(201);
		expect(res.body.status).toBe('success');
	});

	it('Deve cadastrar um novo usuário do tipo "caregiver"', async () => {
		const res = await request(app).post('/signup').send({
			accountType: 'caregiver',
			name: DEFAULT_CAREGIVER.name,
			email: DEFAULT_CAREGIVER.email,
			password: DEFAULT_CAREGIVER.password,
		});

		expect(res.statusCode).toEqual(201);
		expect(res.body.status).toBe('success');
	});

	it('Deve retornar um erro 400 quando accountType for diferente de "patient" ou "caregiver"', async () => {
		const res = await request(app).post('/signup').send({
			accountType: 'other',
			name: DEFAULT_USER.name,
			email: DEFAULT_USER.email,
			password: DEFAULT_USER.password,
		});

		const error = {
			status: 'error',
			message: 'Invalid request',
		};

		expect(res.statusCode).toEqual(400);
		expect(res.body).toEqual(error);
	});

	it('Deve retornar um erro 400 quando faltar dados no body', async () => {
		const res = await request(app).post('/signup').send({
			accountType: '',
			name: '',
			email: '',
			password: '',
		});

		const error = {
			status: 'error',
			message: 'Invalid request',
		};

		expect(res.statusCode).toEqual(400);
		expect(res.body).toEqual(error);
	});

	it('Deve retornar um erro 500 ao tentar usar e-mail já cadastrado', async () => {
		const res = await request(app).post('/signup').send({
			accountType: 'patient',
			name: DEFAULT_USER.name,
			email: DEFAULT_USER.email,
			password: DEFAULT_USER.password,
		});

		const error = {
			status: 'error',
			message: 'User already exists!',
		};

		expect(res.statusCode).toEqual(500);
		expect(res.body).toEqual(error);
	});
});
