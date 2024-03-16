import { Router } from 'express';

import { signupController } from './controllers/signupController';

const router = Router();

router.post('/signup', signupController);

router.get('/test-error-route', (req, res) => {
	throw new Error('Internal server error');
});

export { router };
