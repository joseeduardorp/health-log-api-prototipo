import { Router } from 'express';

import { signUp } from './features/signUp/signUpRoute';
import { login } from './features/login/loginRoute';

const router = Router();

signUp(router);
login(router);

export { router };
