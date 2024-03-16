import { NextFunction, Request, Response } from 'express';

import { authService } from '../services/authService';

import { BodyT } from '../types/auth';

async function authController(req: Request, res: Response, next: NextFunction) {
	const { name, email, password, accountType } = req.body as BodyT;

	try {
		const user = await authService({ name, email, password, accountType });

		return res.status(201).json({
			status: 'success',
			userId: user.id,
		});
	} catch (error) {
		next(error);
	}
}

export { authController };
