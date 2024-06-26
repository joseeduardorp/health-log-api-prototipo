import { Knex } from 'knex';

import Database from '../database';

import { IUser, IInsertData, AccountType } from './types/userModel';

class UserModel {
	private client: Knex;

	constructor(db: Database) {
		this.client = db.getClient();
	}

	async rawQuery(query: string) {
		const result = await this.client.raw(query);

		return result;
	}

	async addUser({ name, email, password }: IInsertData) {
		const [user] = await this.client('Users')
			.insert({ name, email, password })
			.returning<IUser[]>('*');

		return user;
	}

	async findByEmail(email: string) {
		const user = await this.client('Users')
			.select()
			.where({ email })
			.returning('*')
			.first<IUser | undefined>();

		return user;
	}

	async addToProfile(userId: number, profileType: AccountType) {
		const profileTable = profileType === 'patient' ? 'Patients' : 'Caregivers';

		const [ids] = await this.client(profileTable)
			.insert({ userId })
			.returning('*');

		return ids;
	}

	async findProfileById(userId: number, profileType: AccountType) {
		const profileTable = profileType === 'patient' ? 'Patients' : 'Caregivers';

		const ids = await this.client(profileTable)
			.select()
			.where({ userId })
			.returning('*')
			.first();

		return ids;
	}
}

export default UserModel;
