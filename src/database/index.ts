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
		try {
			await this.client.connect();
		} catch (error) {
			console.log('Erro ao se conectar ao banco de dados:', error);
		}
	}

	public async disconnect() {
		try {
			await this.client.end();
		} catch (error) {
			console.log('Erro ao se desconectar do banco de dados:', error);
		}
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
