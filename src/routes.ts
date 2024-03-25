import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	const { method, path } = req;

	res.json({
		request: `${method}:${path}`,
	});
});

router.get('/test-error-route', (req, res) => {
	throw new Error('Internal server error');
});

export { router };
