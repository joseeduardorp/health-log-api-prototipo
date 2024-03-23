import { Client } from 'pg';

import { InsertParamsT } from '../types/database';

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

	public async truncate(table: string) {
		try {
			await this.client.query(`TRUNCATE TABLE "${table}" CASCADE;`);
		} catch (error) {
			console.log('truncate error:', error);
		}
	}

	public async insert(table: string, params: InsertParamsT) {
		const cols = params.columns.map((col) => `"${col}"`).join(', ');
		const vals = params.columns.map((v, i) => `$${i + 1}`);

		const query = `INSERT INTO "${table}" (${cols}) VALUES (${vals}) RETURNING *;`;
		const res = await this.client.query(query, params.values);

		return res.rows[0];
	}

	public async select(
		table: string,
		where?: Record<string, any>,
		limit?: number
	) {
		let query = `SELECT * FROM "${table}"`;

		if (where) {
			const keys = Object.keys(where);
			const filter = keys
				.map((key) => {
					if (typeof where[key] === 'string') return `"${key}"='${where[key]}'`;
					return `"${key}"=${where[key]}`;
				})
				.join(' AND ');

			query += ' WHERE ' + filter;
		}

		if (limit) {
			query += ' LIMIT ' + limit;
		}

		const res = await this.client.query(query);

		return res.rows;
	}
}

export default new Database();
