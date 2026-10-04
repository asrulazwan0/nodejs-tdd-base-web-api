import { loadConfig } from '../../src/config/environment';
export const testConfig = () =>
  loadConfig({
    DB_PASSWORD: 'synthetic-test-password',
    NODE_ENV: 'test',
    LOG_LEVEL: 'silent',
    RATE_LIMIT_MAX: '10000',
  });
