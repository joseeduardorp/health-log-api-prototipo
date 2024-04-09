import Database from '../../database';
import UserModel from '../../models/userModel';

import { ResponseError } from '../../utils/responseError';

import { IBody as IUserData } from './types';

export class Service {
	public async execute({ email, password, accountType }: IUserData) {
		const db = new Database();
		await db.connect();

		const userModel = new UserModel(db);

		const userData = await userModel.findByEmail(email);

		if (!userData) {
			throw new ResponseError(400, 'Incorrect credentials!');
		}

		const passwordMatch = userData.password === password;

		if (!passwordMatch) {
			throw new ResponseError(400, 'Incorrect credentials!');
		}

		const ids = await userModel.findProfileById(userData.id, accountType);

		if (!ids) {
			throw new ResponseError(400, 'Incorrect credentials!');
		}

		const profileId = Number(ids[accountType + 'Id']);

		return {
			userId: userData.id,
			profileId,
			accountType,
		};
	}
}

export default new Service();
