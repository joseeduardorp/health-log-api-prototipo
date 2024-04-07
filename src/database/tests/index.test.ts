import { describe, expect, it } from '@jest/globals';

import Database from '../';

describe('New Model', () => {
	it('Should check instance', async () => {
		const db = new Database();

		expect(db).toBeInstanceOf(Database);
	});
});
