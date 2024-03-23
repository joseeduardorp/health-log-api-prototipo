import { NextFunction, Request, Response } from 'express';

import { signupService } from '../services/signupService';

import { BodyT } from '../types/signup';

async function signupController(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { name, email, password, accountType } = req.body as BodyT;

	try {
		const user = await signupService({ name, email, password, accountType });

		return res.status(201).json({
			status: 'success',
			userId: user.id,
		});
	} catch (error) {
		next(error);
	}
}

export { signupController };
