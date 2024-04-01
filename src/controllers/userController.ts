import { NextFunction, Request, Response } from 'express';

import UserService from '../services/userService';
import { IBody } from '../types/createUser';

import { ResponseError } from '../utils/responseError';

class UserController {
	static async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { name, email, password, accountType } = req.body as IBody;

			if (!name || !email || !password || !accountType) {
				throw new ResponseError(400, 'Invalid request!');
			}

			if (!['patient', 'caregiver'].includes(accountType)) {
				throw new ResponseError(400, 'Invalid request!');
			}

			const user = await UserService.createUser({
				name,
				email,
				password,
				accountType,
			});

			res.status(201).json({
				status: 'success',
				user,
			});
		} catch (error) {
			next(error);
		}
	}
}

export default UserController;
