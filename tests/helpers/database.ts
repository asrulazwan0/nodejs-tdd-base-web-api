import { createDataSource } from '../../src/config/database';
import { loadConfig } from '../../src/config/environment';

/** Fail before connecting or deleting when explicit isolated test credentials are missing. */
export function testDatabaseConfig(env: NodeJS.ProcessEnv = process.env) {
  const name = env.TEST_DB_NAME;
  if (
    env.ALLOW_TEST_DATABASE_RESET !== 'true' ||
    !name ||
    !/^[a-zA-Z0-9_]+_test$/.test(name) ||
    name === env.DB_NAME
  ) {
    throw new Error(
      'Integration tests require explicit reset opt-in and a separate *_test database',
    );
  }
  for (const key of ['HOST', 'PORT', 'USERNAME', 'PASSWORD']) {
    if (!env[`TEST_DB_${key}`]) throw new Error(`Missing TEST_DB_${key}`);
  }
  return loadConfig({
    NODE_ENV: 'test',
    LOG_LEVEL: 'silent',
    DB_HOST: env.TEST_DB_HOST,
    DB_PORT: env.TEST_DB_PORT,
    DB_USERNAME: env.TEST_DB_USERNAME,
    DB_PASSWORD: env.TEST_DB_PASSWORD,
    DB_NAME: name,
  });
}
export const testDatabase = () => createDataSource(testDatabaseConfig());
