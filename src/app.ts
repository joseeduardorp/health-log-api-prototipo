import express, { NextFunction, Request, Response } from 'express';

import { router } from './routes';

const app = express();

app.use(express.json());
app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	return res.status(500).json({
		status: 'error',
		message: 'Internal server error',
	});
});

export default app;
