import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

import app from '../app';
import db from '../database';

function genRandomUser() {
	return Math.random().toString(32).substring(2, 12);
}

describe('Autenticação do usuário', () => {
	beforeAll((done) => {
		done();
	});

	afterAll((done) => {
		db.disconnect().then(() => done());
	});

	it('Deve cadastrar um novo usuário do tipo "patient"', async () => {
		const randomUser = genRandomUser();
		const res = await request(app)
			.post('/signup')
			.send({
				accountType: 'patient',
				name: randomUser,
				email: randomUser + '@gmail.com',
				password: 'senha',
			});

		expect(res.statusCode).toEqual(201);
		expect(res.body.status).toBe('success');
	});

	it('Deve cadastrar um novo usuário do tipo "caregiver"', async () => {
		const randomUser = genRandomUser();
		const res = await request(app)
			.post('/signup')
			.send({
				accountType: 'caregiver',
				name: randomUser,
				email: randomUser + '@gmail.com',
				password: 'senha',
			});

		expect(res.statusCode).toEqual(201);
		expect(res.body.status).toBe('success');
	});

	it('Deve retornar um erro 400 quando accountType for diferente de "patient" ou "caregiver"', async () => {
		const randomUser = genRandomUser();
		const res = await request(app)
			.post('/signup')
			.send({
				accountType: 'strange',
				name: randomUser,
				email: randomUser + '@gmail.com',
				password: 'senha',
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
			name: 'Fulano',
			email: 'fulano@gmail.com',
			password: 'senha',
		});

		const error = {
			status: 'error',
			message: 'Erro ao inserir usuário no banco',
		};

		expect(res.statusCode).toEqual(500);
		expect(res.body).toEqual(error);
	});
});
