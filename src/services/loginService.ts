import db from '../database';

import { BodyT } from '../types/login';
import { UserT, AccountTypeT } from '../types/user';
import { CustomError } from '../utils/customError';

const accountTypeTable: Record<AccountTypeT, string> = {
	patient: 'Patients',
	caregiver: 'Caregivers',
};

async function loginService({
	email,
	password,
	accountType,
}: BodyT): Promise<any> {
	if (!accountType || !email || !password) {
		throw new CustomError(400, 'Invalid request');
	}

	if (!['patient', 'caregiver'].includes(accountType)) {
		throw new CustomError(400, 'Invalid request');
	}

	const [user]: UserT[] = await db.select('Users', {
		email,
		password,
	});

	if (!user) {
		throw new CustomError(404, 'Usuário não encontrado');
	}

	const [userType] = await db.select(accountTypeTable[accountType], {
		userId: user.id,
	});

	if (!userType) {
		throw new CustomError(
			500,
			'Usuário existe, mas não foi encontrado como paciente ou cuidador'
		);
	}

	const key = accountType + 'Id';
	return {
		[key]: user.id,
	};
}

export { loginService };
