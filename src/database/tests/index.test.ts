import { describe, expect, it } from '@jest/globals';

import Database from '../';

describe('Unit - Database', () => {
	it('Should check instance', async () => {
		const db = new Database();

		expect(db).toBeInstanceOf(Database);
	});
});
