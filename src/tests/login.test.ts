import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

import app from '../app';
import db from '../database';

describe('Acessar conta do usuário', () => {
	beforeAll((done) => {
		done();
	});

	afterAll((done) => {
		db.disconnect().then(() => done());
	});

	it('Deve acessar a conta como usuário do tipo "patient"', async () => {
		const res = await request(app).post('/login').send({
			accountType: 'patient',
			email: 'telbpdnccb@gmail.com',
			password: 'senha',
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body.status).toBe('success');
		expect(res.body).toHaveProperty('accountId');
	});

	it('Deve acessar a conta como usuário do tipo "caregiver"', async () => {
		const res = await request(app).post('/login').send({
			accountType: 'caregiver',
			email: 'kdqbk5pdk6@gmail.com',
			password: 'senha',
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body.status).toBe('success');
		expect(res.body).toHaveProperty('accountId');
	});

	it('Deve retornar um erro 404 quando usar credênciais inválidas', async () => {
		const res = await request(app).post('/login').send({
			accountType: 'caregiver',
			email: 'kdqbk5pdk6@gmail.com',
			password: 'senhaincorreta',
		});

		const error = {
			status: 'error',
			message: 'Usuário não encontrado',
		};

		expect(res.statusCode).toEqual(404);
		expect(res.body).toEqual(error);
	});

	it('Deve retornar um erro 400 quando faltar dados no body', async () => {
		const res = await request(app).post('/login').send({
			accountType: '',
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

	it('Deve retornar um erro 400 quando accountType for diferente de "patient" ou "caregiver"', async () => {
		const res = await request(app).post('/login').send({
			accountType: 'other',
			email: 'kdqbk5pdk6@gmail.com',
			password: 'senha',
		});

		const error = {
			status: 'error',
			message: 'Invalid request',
		};

		expect(res.statusCode).toEqual(400);
		expect(res.body).toEqual(error);
	});

	it('Deve retornar um erro 404 quando usar e-mail não cadastrado', async () => {
		const res = await request(app).post('/login').send({
			accountType: 'patient',
			email: 'emaildoesnotexists@gmail.com',
			password: 'senha',
		});

		const error = {
			status: 'error',
			message: 'Usuário não encontrado',
		};

		expect(res.statusCode).toEqual(404);
		expect(res.body).toEqual(error);
	});

	it('Deve retornar um erro 500 quando o usuário existe, mas não está cadastrado como "patient" ou "caregiver"', async () => {
		const res = await request(app).post('/login').send({
			accountType: 'patient',
			email: 'fulano@gmail.com',
			password: 'senha',
		});

		const error = {
			status: 'error',
			message:
				'Usuário existe, mas não foi encontrado como paciente ou cuidador',
		};

		expect(res.statusCode).toEqual(500);
		expect(res.body).toEqual(error);
	});
});
