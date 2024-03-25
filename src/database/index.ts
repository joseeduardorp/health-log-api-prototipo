import knex, { Knex } from 'knex';

import config from '../../config';

class Database {
	private client: Knex;

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
}

export default new Database();
