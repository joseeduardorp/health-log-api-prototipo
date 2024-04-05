import { AccountType } from '../../models/types/userModel';

export interface IBody {
	name: string;
	email: string;
	password: string;
	accountType: AccountType;
}
