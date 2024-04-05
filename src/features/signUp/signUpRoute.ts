import { Router } from 'express';

import controller from './signUpController';

function signUp(router: Router) {
	router.post('/signup', controller.handler);
}

export { signUp };
