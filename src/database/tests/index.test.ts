import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';

import Database from '../';

describe('Unit - Database', () => {
	let db: Database;

	beforeEach(async () => {
		db = new Database();
	});

	afterEach(async () => {
		await db.disconnect();
	});

	it('Should connect to the database if client is null', async () => {
		expect(db['client']).toBeNull();

		await db.connect();

		expect(db['client']).toBeTruthy();
	});

	it('Should connect to the database if client is not null', async () => {
		await db.connect();

		expect(db['client']).toBeTruthy();

		await db.connect();
	});

	it('Should disconnect to database', async () => {
		await db.connect();

		await db.disconnect();

		expect(db['client']).toBeNull();
	});

	it('Should throw an error when getClient() is called before connecting', async () => {
		const catchError = () => {
			db.getClient();
		};

		expect(catchError).toThrowError('Database not connected!');
	});

	it('Should return Knex client when getClient() is called after connecting', async () => {
		await db.connect();

		const client = db.getClient();

		expect(client).toBeTruthy();
	});
});
