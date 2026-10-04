import { randomUUID } from 'node:crypto';
import { UserService } from '../../src/services/user.service';
import { MemoryRepository } from '../helpers/memory-repository';
import { testConfig } from '../helpers/config';
import { loadConfig } from '../../src/config/environment';
import { createDataSource } from '../../src/config/database';
import { migrate } from '../../src/config/migrate';

const input = { email: 'john@example.test', firstName: 'John', lastName: 'Doe' };
let repo: MemoryRepository;
let service: UserService;
beforeEach(() => {
  repo = new MemoryRepository();
  service = new UserService(repo);
});

test('create normalizes email and names', async () => {
  expect(
    await service.create({ ...input, email: ' JOHN@EXAMPLE.TEST ', firstName: ' John ' }),
  ).toMatchObject(input);
});
test.each(['', ' ', 'bad\0name', 'bad\nname', 'x'.repeat(51)])(
  'rejects invalid names without writing: %j',
  async (firstName) => {
    await expect(service.create({ ...input, firstName })).rejects.toThrow();
    expect(repo.data.size).toBe(0);
  },
);
test.each(['invalid', 'x'.repeat(255) + '@example.test'])(
  'rejects invalid emails without writing: %j',
  async (email) => {
    await expect(service.create({ ...input, email })).rejects.toThrow();
    expect(repo.data.size).toBe(0);
  },
);
test('partial update preserves unchanged fields', async () => {
  const user = await service.create(input);
  expect(await service.update(user.id, { firstName: 'Jane' })).toMatchObject({
    ...input,
    firstName: 'Jane',
    id: user.id,
    createdAt: user.createdAt,
  });
});
test('duplicate normalized email is a conflict', async () => {
  await service.create(input);
  await expect(service.create({ ...input, email: 'JOHN@EXAMPLE.TEST' })).rejects.toMatchObject({
    status: 409,
  });
});
test('update to another profile email is a conflict', async () => {
  await service.create(input);
  const other = await service.create({ ...input, email: 'other@example.test' });
  await expect(service.update(other.id, { email: input.email })).rejects.toMatchObject({
    status: 409,
  });
});
test('empty update rejects before repository work', async () => {
  await expect(service.update(randomUUID(), {})).rejects.toThrow();
});
test('list supports bounded pagination', async () => {
  await service.create(input);
  const other = await service.create({ ...input, email: 'other@example.test' });
  expect(await service.getAll({ limit: 1, offset: 1 })).toEqual([other]);
  await expect(service.getAll({ limit: 101 })).rejects.toThrow();
});
test('read, update and delete missing profiles return not-found', async () => {
  await expect(service.getById(randomUUID())).rejects.toMatchObject({ status: 404 });
  await expect(service.update(randomUUID(), { firstName: 'Jane' })).rejects.toMatchObject({
    status: 404,
  });
  await expect(service.delete(randomUUID())).rejects.toMatchObject({ status: 404 });
});
test('delete makes a stored profile unavailable', async () => {
  const user = await service.create(input);
  await service.delete(user.id);
  await expect(service.getById(user.id)).rejects.toMatchObject({ status: 404 });
});
test('repository failure propagates without a fabricated result', async () => {
  jest.spyOn(repo, 'findAll').mockRejectedValue(new Error('synthetic failure'));
  await expect(service.getAll()).rejects.toThrow('synthetic failure');
});
test('unknown input fields are rejected', async () => {
  await expect(service.create({ ...input, password: 'secret' })).rejects.toThrow();
});
test.each([
  { PORT: '0' },
  { DB_PORT: 'bad' },
  { DB_PASSWORD: '' },
  { NODE_ENV: 'invalid' },
  { TRUST_PROXY_HOPS: 'true' },
])('configuration rejects invalid values: %j', (override) => {
  expect(() => loadConfig({ DB_PASSWORD: 'synthetic', ...override })).toThrow(
    'Invalid configuration',
  );
});
test('configuration errors omit values', () => {
  expect(() => loadConfig({ DB_PASSWORD: 'secret-test-value', PORT: 'secret-test-value' })).toThrow(
    'Invalid configuration: PORT',
  );
});
test('database creation is disconnected and never synchronizes schema', () => {
  const db = createDataSource(testConfig());
  expect(db.isInitialized).toBe(false);
  expect(db.options.synchronize).toBe(false);
});
test('migration CLI refuses invalid and unapproved destructive commands before connecting', async () => {
  await expect(migrate(['invalid'])).rejects.toThrow('Expected run');
  const original = process.env.DB_PASSWORD;
  process.env.DB_PASSWORD = 'synthetic';
  try {
    await expect(migrate(['revert'])).rejects.toThrow('Revert requires');
  } finally {
    if (original === undefined) delete process.env.DB_PASSWORD;
    else process.env.DB_PASSWORD = original;
  }
});

test('C1 control characters reject before persistence', async () => {
  await expect(service.create({ ...input, firstName: 'C1\u0085Name' })).rejects.toMatchObject({
    name: 'ZodError',
  });
  expect(repo.data.size).toBe(0);
});
test('undefined-only service updates reject before repository work', async () => {
  const update = jest.spyOn(repo, 'update');
  await expect(service.update(randomUUID(), { firstName: undefined })).rejects.toMatchObject({
    name: 'ZodError',
  });
  expect(update).not.toHaveBeenCalled();
});
