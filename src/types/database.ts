import { IUser } from './user';

export interface IUserResult extends IUser {}

export interface IUserInsertData
	extends Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> {}

export type ProfileTypeTables = 'Patients' | 'Caregivers';
