import express from 'express';
import { listen } from '../../src/server';
import { testConfig } from '../helpers/config';
import type { AddressInfo } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

const config = { ...testConfig(), PORT: 0, SHUTDOWN_TIMEOUT_MS: 1000 };
test('shutdown drains in-flight HTTP before closing the database', async () => {
  const events: string[] = [];
  let notify: () => void = () => {};
  const entered = new Promise<void>((resolve) => {
    notify = resolve;
  });
  const app = express();
  app.get('/slow', async (_req, res) => {
    notify();
    await delay(50);
    events.push('response');
    res.end('done');
  });
  const runtime = await listen(app, config, async () => {
    events.push('database');
  });
  const port = (runtime.server.address() as AddressInfo).port;
  const response = fetch(`http://127.0.0.1:${port}/slow`);
  await entered;
  const stopping = runtime.shutdown();
  expect(runtime.shutdown()).toBe(stopping);
  expect(await (await response).text()).toBe('done');
  await stopping;
  expect(events).toEqual(['response', 'database']);
  expect(runtime.server.listening).toBe(false);
});
test('occupied ports fail instead of claiming startup success', async () => {
  const first = await listen(express(), config, async () => {});
  try {
    await expect(
      listen(
        express(),
        { ...config, PORT: (first.server.address() as AddressInfo).port },
        async () => {},
      ),
    ).rejects.toMatchObject({ code: 'EADDRINUSE' });
  } finally {
    await first.shutdown();
  }
});
test('database close failures reject shutdown', async () => {
  const runtime = await listen(express(), config, async () => {
    throw new Error('close failed');
  });
  await expect(runtime.shutdown()).rejects.toThrow('close failed');
});
test('shutdown deadline includes a stuck database close', async () => {
  const runtime = await listen(
    express(),
    { ...config, SHUTDOWN_TIMEOUT_MS: 100 },
    async () => new Promise(() => {}),
  );
  await expect(runtime.shutdown()).rejects.toThrow('Shutdown timeout');
});
