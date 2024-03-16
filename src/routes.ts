import { Router } from 'express';

import { initialController } from './controllers/initialController';

const router = Router();

router.get('/', initialController);

router.get('/test-error-route', (req, res) => {
	throw new Error('Rota para testar erro');
});

export { router };
