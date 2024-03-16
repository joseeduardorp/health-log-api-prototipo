import db from '../database';

import { AccountTypeT, BodyT, UserT } from '../types/signup';
import { CustomError } from '../utils/customError';

const accountTypeTable: Record<AccountTypeT, string> = {
	patient: 'Patients',
	caregiver: 'Caregivers',
};

async function signupService({
	name,
	email,
	password,
	accountType,
}: BodyT): Promise<UserT> {
	if (!accountType || !name || !email || !password) {
		throw new CustomError(400, 'Invalid request');
	}

	if (!['patient', 'caregiver'].includes(accountType)) {
		throw new CustomError(400, 'Invalid request');
	}

	try {
		const user: UserT = await db.insert('Users', {
			columns: ['name', 'email', 'password'],
			values: [name, email, password],
		});

		await db.insert(accountTypeTable[accountType], {
			columns: ['userId'],
			values: [user.id],
		});

		return user;
	} catch (error) {
		throw new Error('Erro ao inserir usuário no banco');
	}
}

export { signupService };
