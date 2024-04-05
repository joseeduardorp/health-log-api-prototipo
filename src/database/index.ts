import knex, { Knex } from 'knex';

import config from '../../config';

import {
	IUserInsertData,
	IUserResult,
	ProfileTypeTables,
} from '../types/database';

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

	public async disconnect() {
		await this.client.destroy();
	}

	public async truncate(table: string) {
		return await this.client.raw('truncate table ?? cascade;', table);
	}

	public async addUser({ name, email, password }: IUserInsertData) {
		const [user] = await this.client('Users')
			.insert({ name, email, password })
			.returning<IUserResult[]>('*');

		return user;
	}

	public async findUserByEmail(email: string) {
		const user = await this.client
			.select()
			.from('Users')
			.where('email', email)
			.first<IUserResult | undefined>();

		return user;
	}

	public async addUserToProfile(
		profileType: ProfileTypeTables,
		userId: string
	) {
		const [profileIds] = await this.client(profileType).insert({ userId }, '*');

		return profileIds;
	}

	public async findUserProfileId(
		profileType: ProfileTypeTables,
		userId: string
	) {
		const ids = await this.client
			.select()
			.from(profileType)
			.where('userId', userId)
			.first();

		return ids;
	}
}

export default new Database();
