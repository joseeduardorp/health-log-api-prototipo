/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	testEnvironment: 'node',
	coverageReporters: ['html', 'text'],
	setupFiles: ['<rootDir>/jest.setup.ts'],
};

export default config;
