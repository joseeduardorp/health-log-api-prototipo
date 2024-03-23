import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

import app from '../app';
import db from '../database';

const DEFAULT_USER = {
	name: 'default user',
	email: 'default.user@email.com',
	password: 'defaultpasswd',
};
const DEFAULT_PATIENT = {
	name: 'patient user',
	email: 'patient.user@email.com',
	password: 'patientpasswd',
};
const DEFAULT_CAREGIVER = {
	name: 'caregiver user',
	email: 'caregiver.user@email.com',
	password: 'caregiverpasswd',
};

async function cleanTables() {
	await db.truncate('Users');
	await db.truncate('Patients');
	await db.truncate('Caregivers');
}

describe('Acessar conta do usuário', () => {
	beforeAll((done) => {
		// cadastra um usuário
		db.insert('Users', {
			columns: ['name', 'email', 'password'],
			values: [DEFAULT_USER.name, DEFAULT_USER.email, DEFAULT_USER.password],
		});

		// cadastra um paciente
		db.insert('Users', {
			columns: ['name', 'email', 'password'],
			values: [
				DEFAULT_PATIENT.name,
				DEFAULT_PATIENT.email,
				DEFAULT_PATIENT.password,
			],
		}).then(async (user) => {
			await db.insert('Patients', {
				columns: ['userId'],
				values: [user.id],
			});
		});

		// cadastra um cuidador
		db.insert('Users', {
			columns: ['name', 'email', 'password'],
			values: [
				DEFAULT_CAREGIVER.name,
				DEFAULT_CAREGIVER.email,
				DEFAULT_CAREGIVER.password,
			],
		}).then(async (user) => {
			await db.insert('Caregivers', {
				columns: ['userId'],
				values: [user.id],
			});
		});

		done();
	});

	afterAll((done) => {
		cleanTables().then(async () => {
			await db.disconnect();

			done();
		});
	});

	it('Deve acessar a conta como usuário do tipo "patient"', async () => {
		const res = await request(app).post('/login').send({
			accountType: 'patient',
			email: DEFAULT_PATIENT.email,
			password: DEFAULT_PATIENT.password,
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body.status).toBe('success');
		expect(res.body).toHaveProperty('accountId');
	});

	it('Deve acessar a conta como usuário do tipo "caregiver"', async () => {
		const res = await request(app).post('/login').send({
			accountType: 'caregiver',
			email: DEFAULT_CAREGIVER.email,
			password: DEFAULT_CAREGIVER.password,
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body.status).toBe('success');
		expect(res.body).toHaveProperty('accountId');
	});

	it('Deve retornar um erro 404 quando usar credênciais inválidas', async () => {
		const res = await request(app).post('/login').send({
			accountType: 'caregiver',
			email: DEFAULT_USER.email,
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

	it('Deve retornar um erro 404 quando usar e-mail não cadastrado', async () => {
		const res = await request(app).post('/login').send({
			accountType: 'patient',
			email: 'emaildoesnotexists@gmail.com',
			password: 'passwd',
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
			email: DEFAULT_USER.email,
			password: DEFAULT_USER.password,
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
