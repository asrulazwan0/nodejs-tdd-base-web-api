import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const base = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';
const call = (path, init) =>
  fetch(new URL(path, base), { ...init, signal: AbortSignal.timeout(5000) });
const json = (input, method = 'POST') => ({
  method,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(input),
});
for (const route of ['/health/live', '/health/ready'])
  assert.equal((await call(route)).status, 200);
const profile = {
  email: `smoke-${randomUUID()}@example.test`,
  firstName: 'Smoke',
  lastName: 'Test',
};
const created = await call('/users', json(profile));
assert.equal(created.status, 201, await created.clone().text());
const user = await created.json();
try {
  assert.equal((await call('/users', json(profile))).status, 409);
  const updated = await call(`/users/${user.id}`, json({ firstName: 'Updated' }, 'PUT'));
  assert.equal(updated.status, 200);
  assert.deepEqual(await updated.json(), {
    ...user,
    firstName: 'Updated',
    updatedAt: (await (await call(`/users/${user.id}`)).json()).updatedAt,
  });
  assert.equal((await call('/users', json({ ...profile, firstName: 'NUL\0Name' }))).status, 400);
  const malformed = await call('/users', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{',
  });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).code, 'INVALID_BODY');
  assert.equal((await call('/missing')).status, 404);
  assert.equal((await call('/openapi.json')).status, 200);
} finally {
  assert.equal((await call(`/users/${user.id}`, { method: 'DELETE' })).status, 204);
}
assert.equal((await call(`/users/${user.id}`)).status, 404);
console.info(
  'Smoke passed: health, CRUD, preserved fields, conflicts, validation, JSON errors, docs and cleanup.',
);
