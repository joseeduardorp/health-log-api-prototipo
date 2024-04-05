import { Router } from 'express';

import { signUp } from './features/signUp/signUpRoute';

const router = Router();

signUp(router);

router.get('/', (req, res) => {
	res.status(200).json({
		status: 'info',
		message: 'Base route',
	});
});

export { router };
