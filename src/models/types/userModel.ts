export interface IUser {
	id: number;
	name: string;
	email: string;
	password: string;
	createdAt: string;
	updatedAt: string;
}

export type AccountType = 'patient' | 'caregiver';

export interface IInsertData {
	name: string;
	email: string;
	password: string;
}
