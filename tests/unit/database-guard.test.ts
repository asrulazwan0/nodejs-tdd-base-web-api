import { testDatabaseConfig } from '../helpers/database';
const valid = {
  ALLOW_TEST_DATABASE_RESET: 'true',
  TEST_DB_HOST: '127.0.0.1',
  TEST_DB_PORT: '3306',
  TEST_DB_USERNAME: 'test',
  TEST_DB_PASSWORD: 'synthetic',
  TEST_DB_NAME: 'tdd_api_test',
};
test('explicit separate test database accepted', () => {
  expect(testDatabaseConfig(valid).DB_NAME).toBe('tdd_api_test');
});
test.each([
  { ALLOW_TEST_DATABASE_RESET: 'false' },
  { TEST_DB_NAME: 'production' },
  { DB_NAME: 'tdd_api_test' },
  { TEST_DB_PASSWORD: '' },
  { TEST_DB_HOST: '' },
  { TEST_DB_PORT: 'bad' },
])('unsafe test settings fail before a connection: %j', (override) => {
  expect(() => testDatabaseConfig({ ...valid, ...override })).toThrow();
});
