import { Router } from 'express';

import { signUp } from './features/signUp/signUpRoute';

const router = Router();

signUp(router);

export { router };
