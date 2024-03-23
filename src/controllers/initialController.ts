import { Request, Response } from 'express';

async function initialController(req: Request, res: Response) {
	const { method, path } = req;

	console.log(`${method}:${path}`);

	return res.status(200).json({
		message: 'Controller básico',
	});
}

export { initialController };
