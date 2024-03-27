import { IUser, TAccountType } from './user';

export interface IBody extends Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> {
	accountType: TAccountType;
}
