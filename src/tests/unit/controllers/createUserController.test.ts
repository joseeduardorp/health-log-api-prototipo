import {
	describe,
	it,
	jest,
	beforeEach,
	expect,
	afterAll,
	beforeAll,
	afterEach,
} from '@jest/globals';
import { SpyInstance } from 'jest-mock';
import { Request, Response, NextFunction } from 'express';

import * as createUserService from '../../../services/createUserService';
import { createUserController } from '../../../controllers/createUserController';
import { IBody as IUserData } from '../../../types/createUser';

import { ResponseError } from '../../../utils/responseError';

import db from '../../../database';

describe('Create User Controller', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: jest.Mock<NextFunction>;
	let createUserServiceSpy: SpyInstance<any>;

	beforeEach(() => {
		req = { body: {} };
		res = {
			json: jest.fn<(body?: any) => Response>(),
		};
		next = jest.fn();
		createUserServiceSpy = jest.spyOn(createUserService, 'createUserService');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	beforeAll((done) => {
		db.truncate('Users').then(() => done());
	});

	afterAll((done) => {
		db.disconnect().then(() => done());
	});

	it('Should create a new patient user with body data', async () => {
		const patientData: IUserData = {
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
			accountType: 'patient',
		};
		req.body = patientData;

		const patientUser = {
			id: '1',
			name: patientData.name,
			email: patientData.email,
			accountType: patientData.accountType,
		};
		createUserServiceSpy.mockResolvedValue(patientUser);

		await createUserController(
			req as Request,
			res as Response,
			next as unknown as NextFunction
		);

		expect(res.json).toHaveBeenCalledWith({
			status: 'success',
			user: patientUser,
		});
	});

	it('Should create a new caregiver user with body data', async () => {
		const caregiverData: IUserData = {
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
			accountType: 'caregiver',
		};
		req.body = caregiverData;

		const caregiverUser = {
			id: '2',
			name: caregiverData.name,
			email: caregiverData.email,
			accountType: caregiverData.accountType,
		};
		createUserServiceSpy.mockResolvedValue(caregiverUser);

		await createUserController(
			req as Request,
			res as Response,
			next as unknown as NextFunction
		);

		expect(res.json).toHaveBeenCalledWith({
			status: 'success',
			user: caregiverUser,
		});
	});

	it('Should throw a 400 error when body data is missing', async () => {
		const userData: IUserData = {
			name: '',
			email: '',
			password: '',
			accountType: 'caregiver',
		};

		req.body = userData;

		await createUserController(
			req as Request,
			res as Response,
			next as unknown as NextFunction
		);

		expect(next).toHaveBeenCalledWith(
			new ResponseError(400, 'Invalid request!')
		);
	});

	it('Should throw a 400 error when accountType property is different from "patient" or "caregiver"', async () => {
		const userData = {
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
			accountType: 'other',
		};

		req.body = userData;

		await createUserController(
			req as Request,
			res as Response,
			next as unknown as NextFunction
		);

		expect(next).toHaveBeenCalledWith(
			new ResponseError(400, 'Invalid request!')
		);
	});
});
