import request from 'supertest';
import { randomUUID } from 'node:crypto';
import pino from 'pino';
import { Writable } from 'node:stream';
import { createApp } from '../../src/app';
import { MemoryRepository } from '../helpers/memory-repository';
import { testConfig } from '../helpers/config';

const input = { email: 'john@example.test', firstName: 'John', lastName: 'Doe' };
let repo: MemoryRepository;
const build = (
  isReady = async () => true,
  config = testConfig(),
  logger = pino({ level: 'silent' }),
) => createApp({ users: repo, config, logger, isReady });
beforeEach(() => {
  repo = new MemoryRepository();
});

test('CRUD runs through the real app factory', async () => {
  const app = build();
  expect((await request(app).get('/users').expect(200)).body).toEqual([]);
  const created = await request(app).post('/users').send(input).expect(201);
  expect(created.body).toMatchObject(input);
  expect(created.body.id).toMatch(/^[a-f0-9-]{36}$/);
  await request(app).get(`/users/${created.body.id}`).expect(200);
  const updated = await request(app)
    .put(`/users/${created.body.id}`)
    .send({ firstName: 'Jane' })
    .expect(200);
  expect(updated.body).toMatchObject({ ...input, firstName: 'Jane' });
  await request(app).delete(`/users/${created.body.id}`).expect(204);
  await request(app).get(`/users/${created.body.id}`).expect(404);
});
test('duplicate email returns stable conflict JSON', async () => {
  const app = build();
  await request(app).post('/users').send(input).expect(201);
  const response = await request(app).post('/users').send(input).expect(409);
  expect(response.body).toMatchObject({ code: 'EMAIL_CONFLICT', error: 'Email already exists' });
});
test('malformed JSON returns JSON validation error', async () => {
  const response = await request(build())
    .post('/users')
    .set('content-type', 'application/json')
    .send('{')
    .expect(400);
  expect(response.headers['content-type']).toMatch(/application\/json/);
  expect(response.body.code).toBe('INVALID_BODY');
});
test('unknown routes return JSON 404', async () => {
  const response = await request(build()).get('/unknown').expect(404);
  expect(response.body.code).toBe('NOT_FOUND');
});
test('empty updates reject without mutation', async () => {
  const app = build();
  const user = await request(app).post('/users').send(input).expect(201);
  await request(app).put(`/users/${user.body.id}`).send({}).expect(400);
  expect(repo.data.get(user.body.id)).toMatchObject(input);
});
test.each([
  { firstName: ' ' },
  { firstName: 'NUL\0Name' },
  { email: 'bad' },
  { lastName: 'x'.repeat(51) },
  { password: 'secret' },
])('invalid create rejects without writing: %j', async (override) => {
  await request(build())
    .post('/users')
    .send({ ...input, ...override })
    .expect(400);
  expect(repo.data.size).toBe(0);
});
test.each(['get', 'put', 'delete'] as const)(
  '%s validates UUID route parameters',
  async (method) => {
    await request(build())[method]('/users/invalid').send({ firstName: 'Jane' }).expect(400);
  },
);
test.each(['get', 'put', 'delete'] as const)(
  '%s returns 404 for a valid missing UUID',
  async (method) => {
    const call = request(build());
    await call[method](`/users/${randomUUID()}`).send({ firstName: 'Jane' }).expect(404);
  },
);
test('oversized JSON is a stable 413', async () => {
  expect(
    (
      await request(build())
        .post('/users')
        .send({ firstName: 'a'.repeat(17000) })
        .expect(413)
    ).body.code,
  ).toBe('INVALID_BODY');
});
test('liveness stays available while readiness reports database failure', async () => {
  const app = build(async () => {
    throw new Error('private database failure');
  });
  await request(app).get('/health/live').expect(200);
  expect((await request(app).get('/health/ready').expect(503)).body).toEqual({
    status: 'UNAVAILABLE',
  });
});
test('readiness succeeds only when its dependency is ready', async () => {
  await request(build()).get('/health/ready').expect(200);
  await request(build(async () => false))
    .get('/health/ready')
    .expect(503);
});
test('API docs and static OpenAPI are served without a database', async () => {
  await request(build()).get('/api-docs/').expect(200);
  const spec = await request(build()).get('/openapi.json').expect(200);
  expect(spec.body.paths['/users'].post.responses['201']).toBeDefined();
});
test('request IDs are bounded and returned in errors', async () => {
  const good = await request(build()).get('/unknown').set('x-request-id', 'test_request-1');
  expect(good.body.requestId).toBe('test_request-1');
  const bad = await request(build()).get('/unknown').set('x-request-id', 'private@example.test');
  expect(bad.headers['x-request-id']).not.toBe('private@example.test');
});
test('rate limiting returns JSON 429 and leaves health available', async () => {
  const app = build(async () => true, { ...testConfig(), RATE_LIMIT_MAX: 1 });
  await request(app).get('/users').expect(200);
  expect((await request(app).get('/users').expect(429)).body.code).toBe('RATE_LIMITED');
  await request(app).get('/health/live').expect(200);
});
test('failure responses and logs never serialize profiles, URLs or driver errors', async () => {
  const logs: string[] = [];
  const sink = new Writable({
    write(chunk, _encoding, callback) {
      logs.push(String(chunk));
      callback();
    },
  });
  const logger = pino({}, sink);
  jest
    .spyOn(repo, 'findById')
    .mockRejectedValue(new Error('secret-database-password and john@example.test'));
  const app = build(async () => true, testConfig(), logger);
  const response = await request(app).get(`/users/${randomUUID()}?token=secret-token`).expect(500);
  expect(response.body.error).toBe('Internal server error');
  expect(logs.join('')).not.toMatch(/secret-|john@example|\?token/);
  expect(logs.join('')).toContain('/users/:id');
});
test('CORS is disabled by default and explicit origins can be enabled', async () => {
  const response = await request(build()).get('/health').set('Origin', 'https://example.test');
  expect(response.headers['access-control-allow-origin']).toBeUndefined();
  const enabled = await request(
    build(async () => true, { ...testConfig(), CORS_ORIGIN: 'https://example.test' }),
  )
    .get('/health')
    .set('Origin', 'https://example.test');
  expect(enabled.headers['access-control-allow-origin']).toBe('https://example.test');
});
