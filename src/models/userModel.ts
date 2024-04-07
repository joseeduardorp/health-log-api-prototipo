import Database from '../database';

import { IUser, IInsertData, AccountType } from './types/userModel';

class UserModel extends Database {
	constructor() {
		super();
	}

	async findByEmail(email: string) {
		const user = await this.client('Users')
			.select()
			.where({ email })
			.returning('*')
			.first<IUser | undefined>();

		return user;
	}

	async addUser({ name, email, password }: IInsertData) {
		const [user] = await this.client('Users')
			.insert({ name, email, password })
			.returning<IUser[]>('*');

		return user;
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

	async addToProfile(userId: number, profileType: AccountType) {
		const profileTable = profileType === 'patient' ? 'Patients' : 'Caregivers';

		const [ids] = await this.client(profileTable)
			.insert({ userId })
			.returning('*');

		return ids;
	}
}

export default UserModel;
