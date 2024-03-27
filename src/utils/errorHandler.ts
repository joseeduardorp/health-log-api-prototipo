import { NextFunction, Request, Response } from 'express';
import { THandlerError } from '../types/error';
import { ResponseError } from './responseError';

function errorHandler(
	err: THandlerError,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof ResponseError) {
		return res.status(err.statusCode).json({
			status: 'error',
			message: err.message,
		});
	}

	return res.status(500).json({
		status: 'error',
		message: err.message,
	});
}

export { errorHandler };
