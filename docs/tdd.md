# Test-first development

TDD means defining a behavior with a failing test, making it pass, and then improving the structure while preserving that behavior. Jest is the runner; installing Jest does not itself make a project test-first. Clean architecture and TDD can be used together.

## Choose the boundary

- Unit: business decisions and validation with a controlled repository; no MySQL needed.
- HTTP: public status, body, headers and dependency wiring through `createApp`; no listener starts merely by importing it.
- Integration: schema migrations, SQL uniqueness, concurrency, timestamps and actual MySQL persistence.

Test observable outcomes. Avoid copying a repository algorithm into a mock and then asserting that algorithm in a service test. Use real MySQL to establish database semantics.

## Runnable red → green → refactor exercise

Suppose a consuming project needs an API version endpoint. Add `tests/http/version.test.ts`:

```ts
import request from 'supertest';
import pino from 'pino';
import { createApp } from '../../src/app';
import { MemoryRepository } from '../helpers/memory-repository';
import { testConfig } from '../helpers/config';

test('version endpoint reports the documented version', async () => {
  const app = createApp({
    users: new MemoryRepository(),
    config: testConfig(),
    logger: pino({ level: 'silent' }),
    isReady: async () => true,
  });
  const response = await request(app).get('/version').expect(200);
  expect(response.body).toEqual({ version: '1.0.0' });
});
```

Run `npm run test:http -- version.test.ts`. It fails with 404: this is **red**, proving the new behavior is missing. Add `/version` to `openapi.json`, then add the smallest handler to `createApp` before its catch-all:

```ts
app.get('/version', (_req, res) => {
  res.json({ version: '1.0.0' });
});
```

Run the focused command again. It passes: **green**. Then derive the version from one shared configuration/metadata source instead of duplicating the literal. Keep the same test passing: **refactor**. Run `npm run check`, database checks where relevant, and regenerate the Postman collection before opening a PR. This endpoint is an exercise, not a claimed endpoint in the shipped starter.

## Defect workflow

1. Reproduce the failure with the smallest test at its real boundary.
2. Confirm the failure is the intended assertion, not a broken fixture or connection.
3. Implement the fix and run the focused test.
4. Refactor without changing the contract.
5. Run the required quality and database gates; record meaningful evidence in the PR.

The readiness work started with five failing real-repository HTTP regression tests for omitted partial-update fields, duplicate-email errors, malformed JSON, unknown routes and empty updates. Their behavior is covered by the maintained unit/HTTP/MySQL suites; the initial red run is recorded in [verification evidence](verification-evidence.md).

## Coverage

All source is included. Thresholds are a floor, not the goal. Test important failure boundaries and real wiring; do not add assertions solely to increase a percentage. Native startup and production-container smoke complement coverage by exercising compiled artifacts.
