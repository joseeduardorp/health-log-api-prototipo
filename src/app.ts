import express, { NextFunction, Request, Response } from 'express';

import { HandlerError } from './types/error';
import { CustomError } from './utils/customError';

const app = express();

app.use(express.json());
app.use(router);

app.use(
	(err: HandlerError, req: Request, res: Response, next: NextFunction) => {
		if (err instanceof CustomError) {
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
);


export default app;
