import { IBody as IUserData, INewUser } from '../types/createUser';

async function createUserService({
	name,
	email,
	password,
	accountType,
}: IUserData): Promise<INewUser> {
	return {} as INewUser;
}

export { createUserService };
