import { describe, expect, it } from '@jest/globals';
import request from 'supertest';

import app from '../app';

describe('initialController tests', () => {
	it('Deve ter uma mensagem', async () => {
		const res = await request(app).get('/');

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toBe('Controller básico');
	});
});
