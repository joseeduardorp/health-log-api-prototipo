import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';

import app from '../app';
import db from '../database';

describe('Erros genéricos de requisição', () => {
	beforeAll((done) => {
		done();
	});

	afterAll((done) => {
		db.disconnect().then(() => done());
	});

	it('Deve retornar um erro 500', async () => {
		const res = await request(app).get('/test-error-route');

		const error = {
			status: 'error',
			message: 'Internal server error',
		};

		expect(res.status).toEqual(500);
		expect(res.body).toEqual(error);
	});

	it('Deve retornar um erro 404', async () => {
		const res = await request(app).get('/thisroutedoesnotexists');

		expect(res.status).toEqual(404);
	});
});
