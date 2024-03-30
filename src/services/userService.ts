import { IBody as IUserData, INewUser } from '../types/createUser';

class UserService {
	static async createUser({
		name,
		email,
		password,
		accountType,
	}: IUserData): Promise<INewUser> {
		return {} as INewUser;
	}
}

export default UserService;
