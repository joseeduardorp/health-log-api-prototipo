import { UserT as BaseUserT, AccountTypeT } from './user';

export type BodyT = Omit<BaseUserT, 'id' | 'createdAt' | 'updatedAt'> & {
	accountType: AccountTypeT;
};

export type UserT = Omit<BaseUserT, 'password' | 'createdAt' | 'updatedAt'> & {
	accountType: AccountTypeT;
};
