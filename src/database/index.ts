import knex, { Knex } from 'knex';

import config from '../../config';

class Database {
	private client: Knex | null;

	constructor() {
		this.client = null;
	}

	async connect() {
		if (!this.client) {
			this.client = knex({
				client: 'pg',
				connection: {
					host: config.postgresHost,
					port: config.postgresPort,
					user: config.postgresUser,
					password: config.postgresPassword,
					database: config.postgresDb,
				},
			});
		}
	}

	async disconnect() {
		if (this.client) {
			await this.client.destroy();
			this.client = null;
		}
	}

	getClient() {
		if (!this.client) {
			throw new Error('Database not connected!');
		}

		return this.client;
	}
}

export default Database;
