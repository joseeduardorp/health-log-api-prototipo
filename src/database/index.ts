import knex, { Knex } from 'knex';

import config from '../../config';

export class Database {
	protected client: Knex;

	constructor() {
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

	async disconnect() {
		await this.client.destroy();
	}
}

export default new Database();
