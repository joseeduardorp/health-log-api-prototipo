import { describe, expect, it } from '@jest/globals';
import request from 'supertest';

import app from '../app';

describe('Erros genéricos de requisição', () => {
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
		const res = await request(app).get('/this-route-does-not-exists');

		expect(res.status).toEqual(404);
	});
});
