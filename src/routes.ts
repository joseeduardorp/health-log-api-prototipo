import { Router } from 'express';

import { authController } from './controllers/authController';

const router = Router();

router.post('/signup', authController);

router.get('/test-error-route', (req, res) => {
	throw new Error('Rota para testar erro');
});

export { router };
