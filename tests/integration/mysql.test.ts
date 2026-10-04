import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { UserRepository } from '../../src/repositories/UserRepository';
import { UserService } from '../../src/services/user.service';
import { createApp } from '../../src/app';
import { createLogger } from '../../src/logging';
import { CreateUsers1791072000000 } from '../../src/migrations/1791072000000-CreateUsers';
import { testDatabase, testDatabaseConfig } from '../helpers/database';

const db = testDatabase();
let repo: UserRepository;
const input = { email: 'mysql@example.test', firstName: 'MySQL', lastName: 'Test' };
beforeAll(async () => {
  await db.initialize();
  await db.runMigrations();
  repo = new UserRepository(db);
});
afterEach(async () => {
  if (db.isInitialized) await db.query('DELETE FROM users');
});
afterAll(async () => {
  if (db.isInitialized) await db.destroy();
});

test('migrations are repeatable and schema is explicit', async () => {
  expect(await db.showMigrations()).toBe(false);
  expect(await db.runMigrations()).toEqual([]);
});
test('initial migration refuses to overwrite an existing users table', async () => {
  const runner = db.createQueryRunner();
  try {
    await expect(new CreateUsers1791072000000().up(runner)).rejects.toThrow('Existing users table');
  } finally {
    await runner.release();
  }
});
test('profile creation round-trips identity and UTC timestamps', async () => {
  const created = await repo.create(input);
  const stored = await repo.findById(created.id);
  expect(stored).toEqual(created);
  expect(stored?.createdAt).toBeInstanceOf(Date);
});
test('partial update preserves fields and original creation timestamp', async () => {
  const created = await repo.create(input);
  const updated = await repo.update(created.id, { firstName: 'Changed' });
  expect(updated).toMatchObject({ ...input, firstName: 'Changed', createdAt: created.createdAt });
  expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
  expect(await repo.findById(created.id)).toEqual(updated);
});
test('MySQL uniqueness races yield one success and one public conflict', async () => {
  const results = await Promise.allSettled([repo.create(input), repo.create(input)]);
  expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
  const rejected = results.find((result) => result.status === 'rejected');
  expect(rejected?.status === 'rejected' && rejected.reason).toMatchObject({
    status: 409,
    code: 'EMAIL_CONFLICT',
  });
  expect(await repo.findAll({ limit: 100, offset: 0 })).toHaveLength(1);
});
test('update uniqueness violations are mapped and do not mutate the other fields', async () => {
  await repo.create(input);
  const other = await repo.create({ ...input, email: 'other@example.test' });
  await expect(
    repo.update(other.id, { email: input.email, firstName: 'Invalid' }),
  ).rejects.toMatchObject({ status: 409 });
  expect(await repo.findById(other.id)).toMatchObject({
    email: 'other@example.test',
    firstName: input.firstName,
  });
});
test('read/update/delete missing UUIDs return absence', async () => {
  expect(await repo.findById(randomUUID())).toBeNull();
  expect(await repo.update(randomUUID(), { firstName: 'No' })).toBeNull();
  expect(await repo.delete(randomUUID())).toBe(false);
});
test('bounded listing and deletion persist', async () => {
  const first = await repo.create(input);
  await repo.create({ ...input, email: 'other@example.test' });
  expect(await repo.findAll({ limit: 1, offset: 0 })).toHaveLength(1);
  expect(await repo.delete(first.id)).toBe(true);
  expect(await repo.findById(first.id)).toBeNull();
});
test('real application composition handles persisted CRUD and conflicts', async () => {
  const config = testDatabaseConfig();
  const app = createApp({
    users: repo,
    config,
    logger: createLogger(config),
    isReady: async () => db.isInitialized,
  });
  const created = await request(app).post('/users').send(input).expect(201);
  await request(app)
    .post('/users')
    .send({ ...input, email: input.email.toUpperCase() })
    .expect(409);
  expect(
    (await request(app).put(`/users/${created.body.id}`).send({ firstName: 'Updated' }).expect(200))
      .body,
  ).toMatchObject({ ...input, firstName: 'Updated' });
  await request(app).delete(`/users/${created.body.id}`).expect(204);
});
test('local migration revert and reapply operate on the disposable schema', async () => {
  await db.undoLastMigration();
  const runner = db.createQueryRunner();
  try {
    expect(await runner.hasTable('users')).toBe(false);
  } finally {
    await runner.release();
  }
  await db.runMigrations();
  expect(await db.showMigrations()).toBe(false);
});
test('invalid names fail before MySQL persistence', async () => {
  await expect(
    new UserService(repo).create({ ...input, firstName: 'NUL\0Name' }),
  ).rejects.toThrow();
  expect(await repo.findAll({ limit: 100, offset: 0 })).toEqual([]);
});

test('source migration CLI runs and reports status against the explicit test database', async () => {
  const { migrate } = await import('../../src/config/migrate');
  const original = { ...process.env };
  const config = testDatabaseConfig();
  Object.assign(process.env, {
    DB_HOST: config.DB_HOST,
    DB_PORT: String(config.DB_PORT),
    DB_USERNAME: config.DB_USERNAME,
    DB_PASSWORD: config.DB_PASSWORD,
    DB_NAME: config.DB_NAME,
    NODE_ENV: 'test',
  });
  const log = jest.spyOn(console, 'info').mockImplementation(() => {});
  try {
    await migrate(['run']);
    await migrate(['show']);
    expect(log).toHaveBeenCalledWith('No pending migrations');
  } finally {
    log.mockRestore();
    process.env = original;
  }
});
