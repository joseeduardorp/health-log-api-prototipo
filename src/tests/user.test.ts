import { describe, it, expect } from '@jest/globals';
import request from 'supertest';

import app from '../app';

describe('Exemplo de teste', () => {
	it('Deve retornar os dados de teste', async () => {
		const res = await request(app).get('/test');

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('tests');
		expect(res.body.tests.length).toBeGreaterThanOrEqual(1);
		expect(res.body.tests[0]).toStrictEqual({ id: 1, name: 'Some test' });
	});
});
