import { Request, Response } from 'express';

import db from '../database';

import { AccountTypeT, BodyT, UserT } from '../types/auth';

const accountTypeTable: Record<AccountTypeT, string> = {
	patient: 'Patients',
	caregiver: 'Caregivers',
};

async function authController(req: Request, res: Response) {
	const { accountType, name, email, password } = req.body as BodyT;

	if (!accountType || !name || !email || !password) {
		return res.status(400).json({
			status: 'error',
			message: 'Invalid request',
		});
	}

	if (!['patient', 'caregiver'].includes(accountType)) {
		return res.status(400).json({
			status: 'error',
			message: 'Invalid request',
		});
	}

	try {
		const user = await db.insert('Users', {
			columns: ['name', 'email', 'password'],
			values: [name, email, password],
		});
		user.accountType = accountType;

		await db.insert(accountTypeTable[accountType], {
			columns: ['userId'],
			values: [user.id],
		});

		return res.status(201).json({
			status: 'success',
			userId: user.id,
		});
	} catch (error) {
		return res.status(500).json({
			status: 'error',
			message: 'Erro ao inserir usuário no banco',
		});
	}
}

export { authController };
