import env from 'env-var';

const config = {
	postgresHost: env.get('POSTGRES_HOST').default('localhost').asString(),
	postgresPort: env.get('POSTGRES_PORT').default(5432).asPortNumber(),
	postgresDb: env.get('POSTGRES_DB').required().asString(),
	postgresUser: env.get('POSTGRES_USER').default('postgres').asString(),
	postgresPassword: env.get('POSTGRES_PASSWORD').required().asString(),
};

export default config;
