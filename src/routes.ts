import { Router } from 'express';

import { signupController } from './controllers/signupController';
import { loginController } from './controllers/loginController';

const router = Router();

router.post('/signup', signupController);
router.post('/login', loginController);

router.get('/test-error-route', (req, res) => {
	throw new Error('Internal server error');
});

export { router };
