import { Router } from 'express';

import { createUserController } from './controllers/createUserController';

const router = Router();

router.get('/', createUserController);

export { router };
