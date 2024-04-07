import UserModel from '../../models/userModel';

import { ResponseError } from '../../utils/responseError';

import { IBody as IUserData } from './types';

export class Service {
	public async execute({ name, email, password, accountType }: IUserData) {
		const userModel = new UserModel();

		const userData = await userModel.findByEmail(email);

		if (userData) {
			const profileId = await userModel.findProfileById(
				userData.id,
				accountType
			);

			if (profileId) {
				throw new ResponseError(
					409,
					'You already have an account like ' + accountType
				);
			}

			const ids = await userModel.addToProfile(userData.id, accountType);
			const newProfileId = Number(ids[accountType + 'Id']);

			return {
				userId: userData.id,
				profileId: newProfileId,
				name,
				email,
				accountType,
			};
		}

		const user = await userModel.addUser({ name, email, password });
		const ids = await userModel.addToProfile(user.id, accountType);
		const newProfileId = Number(ids[accountType + 'Id']);

		return {
			userId: user.id,
			profileId: newProfileId,
			name,
			email,
			accountType,
		};
	}
}

export default new Service();
