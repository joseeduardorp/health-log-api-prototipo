import { IUser } from './user';

export interface IUserResult extends IUser {}

export interface IUserInsertData
	extends Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> {}
