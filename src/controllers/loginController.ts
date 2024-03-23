import { NextFunction, Request, Response } from 'express';

import { loginService } from '../services/loginService';

import { BodyT } from '../types/login';

async function loginController(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { email, password, accountType } = req.body as BodyT;

	try {
		const accountId = await loginService({ email, password, accountType });

		return res.status(200).json({
			status: 'success',
			accountId,
		});
	} catch (error) {
		next(error);
	}
}

export { loginController };
