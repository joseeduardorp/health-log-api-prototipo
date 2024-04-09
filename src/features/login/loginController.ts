import { NextFunction, Request, Response } from 'express';

import { ResponseError } from '../../utils/responseError';

import service from './loginService';

import { IBody } from './types';

export class Controller {
	async handler(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password, accountType } = req.body as IBody;

			if (!email || !password || !accountType) {
				throw new ResponseError(400, 'Invalid request!');
			}

			if (!['patient', 'caregiver'].includes(accountType)) {
				throw new ResponseError(400, 'Invalid request!');
			}

			const user = await service.execute({
				email,
				password,
				accountType,
			});

			res.status(200).json({
				status: 'success',
				user,
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new Controller();
