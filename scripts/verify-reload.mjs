import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import assert from 'node:assert/strict';
const file = new URL('../src/app.ts', import.meta.url);
const base = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';
const original = await readFile(file, 'utf8');
async function awaitStatus(status) {
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const response = await fetch(new URL('/health/live', base), {
        signal: AbortSignal.timeout(1000),
      });
      if ((await response.json()).status === status) return;
    } catch {
      /* Await the owned development server's startup or reload. */
    }
    await delay(250);
  }
  throw new Error(`Source reload did not produce ${status}`);
}
await awaitStatus('OK');
try {
  assert.ok(original.includes("res.json({ status: 'OK' });"));
  await writeFile(
    file,
    original.replace("res.json({ status: 'OK' });", "res.json({ status: 'RELOAD_CHECK' });"),
  );
  await awaitStatus('RELOAD_CHECK');
} finally {
  await writeFile(file, original);
  await awaitStatus('OK');
}
console.info('Development source reload and exact source restoration passed.');
