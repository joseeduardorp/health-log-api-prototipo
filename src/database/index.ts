import { Client } from 'pg';

import { InsertParamsT } from './types';

class Database {
	private client: Client;

	constructor() {
		this.client = new Client({
			host: 'localhost',
			port: 5432,
			database: 'cdr_proto',
			user: 'postgres',
			password: 'remedios',
		});

		this.connect();
	}

	public async connect() {
		await this.client.connect();
	}

	public async disconnect() {
		await this.client.end();
	}

	public async insert(table: string, params: InsertParamsT) {
		const cols = params.columns.map((col) => `"${col}"`).join(', ');
		const vals = params.columns.map((v, i) => `$${i + 1}`);

		const query = `INSERT INTO "${table}" (${cols}) VALUES (${vals}) RETURNING *;`;
		const res = await this.client.query(query, params.values);

		return res.rows[0];
	}
}

export default new Database();
