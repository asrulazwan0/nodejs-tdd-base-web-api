import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { createServer } from 'node:net';
import assert from 'node:assert/strict';

// Choose a free owned port and use only explicitly supplied database settings.
const probe = createServer();
probe.listen(0, '127.0.0.1');
await once(probe, 'listening');
const port = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
const env = {
  ...process.env,
  NODE_ENV: 'production',
  HOST: '127.0.0.1',
  PORT: String(port),
  LOG_LEVEL: 'silent',
};
const run = async (file, args = []) => {
  const child = spawn(process.execPath, [file, ...args], { env, stdio: 'inherit' });
  const [code] = await once(child, 'exit');
  assert.equal(code, 0, `${file} failed`);
};
await run('dist/config/migrate.js', ['run']);
const server = spawn(process.execPath, ['dist/index.js'], { env, stdio: 'inherit' });
const exited = once(server, 'exit');
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health/ready`, {
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* Readiness may be unavailable during startup. */
    }
    if (server.exitCode !== null) break;
    await delay(250);
  }
  assert.ok(ready, 'Compiled native startup/readiness failed');
  const smoke = spawn(process.execPath, ['scripts/smoke.mjs'], {
    env: { ...env, SMOKE_BASE_URL: `http://127.0.0.1:${port}` },
    stdio: 'inherit',
  });
  assert.equal((await once(smoke, 'exit'))[0], 0);
} finally {
  server.kill('SIGTERM');
  const timeout = setTimeout(() => server.kill('SIGKILL'), 12000);
  const [code, signal] = await exited;
  clearTimeout(timeout);
  // Windows process termination does not dispatch POSIX SIGTERM to Node.
  if (process.platform !== 'win32') {
    assert.equal(code, 0);
    assert.equal(signal, null);
  }
}
console.info(
  `Compiled native MySQL startup, migration, HTTP and cleanup passed (${process.platform}).`,
);
