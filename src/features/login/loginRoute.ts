import { Router } from 'express';

import controller from './loginController';

function login(router: Router) {
	router.post('/login', controller.handler);
}

export { login };
