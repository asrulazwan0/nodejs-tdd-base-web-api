import { spawnSync } from 'node:child_process';
import request from 'supertest';
import * as environment from '../../src/config/environment';
import * as database from '../../src/config/database';
import { start } from '../../src/index';
import { testConfig } from '../helpers/config';

const originalTerm = process.listeners('SIGTERM');
const originalInt = process.listeners('SIGINT');
afterEach(() => {
  for (const [signal, original] of [
    ['SIGTERM', originalTerm],
    ['SIGINT', originalInt],
  ] as const) {
    for (const listener of process.listeners(signal))
      if (!original.includes(listener)) process.removeListener(signal, listener);
  }
  jest.restoreAllMocks();
});
function fakeDatabase() {
  const config = { ...testConfig(), PORT: 0 };
  const db = database.createDataSource(config);
  jest.spyOn(environment, 'loadConfig').mockReturnValue(config);
  jest.spyOn(database, 'createDataSource').mockReturnValue(db);
  jest.spyOn(db, 'initialize').mockImplementation(async () => {
    Object.defineProperty(db, 'isInitialized', { value: true, configurable: true });
    return db;
  });
  jest.spyOn(db, 'destroy').mockImplementation(async () => {
    Object.defineProperty(db, 'isInitialized', { value: false, configurable: true });
  });
  jest.spyOn(db, 'showMigrations').mockResolvedValue(false);
  jest.spyOn(db, 'query').mockResolvedValue([{ result: 1 }]);
  return db;
}
test('production bootstrap composes readiness and closes its database', async () => {
  const db = fakeDatabase();
  const runtime = await start();
  try {
    await request(runtime.server).get('/health/ready').expect(200);
    expect(db.query).toHaveBeenCalledWith('SELECT 1');
    jest.spyOn(db, 'query').mockRejectedValue(new Error('synthetic database outage'));
    await request(runtime.server).get('/health/ready').expect(503);
  } finally {
    await runtime.shutdown();
  }
  expect(db.destroy).toHaveBeenCalledTimes(1);
});
test('pending migrations stop startup and close the connection', async () => {
  const db = fakeDatabase();
  jest.spyOn(db, 'showMigrations').mockResolvedValue(true);
  await expect(start()).rejects.toThrow('Startup failed');
  expect(db.destroy).toHaveBeenCalledTimes(1);
});
test('failed connection never claims a listener or destroys an uninitialized connection', async () => {
  const db = fakeDatabase();
  jest.spyOn(db, 'initialize').mockRejectedValue(new Error('private connection details'));
  await expect(start()).rejects.toThrow('Startup failed');
  expect(db.destroy).not.toHaveBeenCalled();
});

test('executable startup reports invalid configuration keys without exposing values', () => {
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'src/index.ts'], {
    encoding: 'utf8',
    env: { ...process.env, PORT: 'bad', DB_PASSWORD: 'private-configuration-marker' },
  });
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Invalid configuration: PORT');
  expect(result.stderr).not.toContain('private-configuration-marker');
});
