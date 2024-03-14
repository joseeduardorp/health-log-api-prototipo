export type AccountTypeT = 'patient' | 'caregiver';

export type BodyT = {
	name: string;
	email: string;
	password: string;
	accountType: AccountTypeT;
};

export type UserT = {
	id: string;
	name: string;
	email: string;
	accountType: AccountTypeT;
};
