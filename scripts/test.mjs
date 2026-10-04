import { spawnSync } from 'node:child_process';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
try {
  loadEnvFile('.env.test');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
process.env.NODE_ENV = 'test';
const mode = process.argv[2];
if (!['integration', 'coverage'].includes(mode))
  throw new Error('Expected integration or coverage');
const args = mode === 'integration' ? ['--selectProjects', 'integration'] : ['--coverage'];
const result = spawnSync(
  process.execPath,
  [
    fileURLToPath(new URL('../node_modules/jest/bin/jest.js', import.meta.url)),
    ...args,
    '--runInBand',
    ...process.argv.slice(3),
  ],
  { stdio: 'inherit' },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
