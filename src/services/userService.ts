import db from '../database';

import { ResponseError } from '../utils/responseError';

import { IBody as IUserData, INewUser } from '../types/createUser';
import { ProfileTypeTables } from '../types/database';

class UserService {
	static async createUser({
		name,
		email,
		password,
		accountType,
	}: IUserData): Promise<INewUser> {
		const userData = await db.findUserByEmail(email);

		const table = (
			accountType === 'patient' ? 'Patients' : 'Caregivers'
		) as ProfileTypeTables;

		if (userData) {
			const profileId = await db.findUserProfileId(table, userData.id);

			if (profileId) {
				throw new ResponseError(
					409,
					'You already have an account like ' + accountType
				);
			}

			await db.addUserToProfile(table, userData.id);

			return {
				id: userData.id,
				name: userData.name,
				email: userData.email,
				accountType,
			};
		}

		const newUser = await db.addUser({ name, email, password });
		await db.addUserToProfile(table, newUser.id);

		return {
			id: newUser.id,
			name: newUser.name,
			email: newUser.email,
			accountType,
		};
	}
}

export default UserService;
