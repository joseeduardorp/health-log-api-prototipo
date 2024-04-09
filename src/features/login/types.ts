import { AccountType } from '../../models/types/userModel';

export interface IBody {
	email: string;
	password: string;
	accountType: AccountType;
}
