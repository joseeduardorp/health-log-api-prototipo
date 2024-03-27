import { NextFunction, Request, Response } from 'express';

import { createUserService } from '../services/createUserService';
import { IBody } from '../types/createUser';

import { ResponseError } from '../utils/responseError';

async function createUserController(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { name, email, password, accountType } = req.body as IBody;

		if (!name || !email || !password || !accountType) {
			throw new ResponseError(400, 'Invalid request!');
		}

		if (!['patient', 'caregiver'].includes(accountType)) {
			throw new ResponseError(400, 'Invalid request!');
		}

		const user = await createUserService({
			name,
			email,
			password,
			accountType,
		});

		res.json({
			status: 'success',
			user,
		});
	} catch (error) {
		next(error);
	}
}

export { createUserController };
