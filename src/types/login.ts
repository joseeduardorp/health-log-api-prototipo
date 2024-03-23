import { UserT, AccountTypeT } from './user';

export type BodyT = Omit<UserT, 'id' | 'name' | 'createdAt' | 'updatedAt'> & {
	accountType: AccountTypeT;
};
