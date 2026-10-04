import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
const project = `tdd-test-${randomUUID().slice(0, 8)}`;
const args = ['compose', '-p', project, '-f', 'compose.test.yml'];
let code;
try {
  const result = spawnSync(
    'docker',
    [...args, 'up', '--build', '--abort-on-container-exit', '--exit-code-from', 'test'],
    { stdio: 'inherit' },
  );
  if (result.error) throw result.error;
  code = result.status ?? 1;
} finally {
  const result = spawnSync('docker', [...args, 'down', '--volumes', '--remove-orphans'], {
    stdio: 'inherit',
  });
  if (result.status !== 0) code = 1;
}
process.exitCode = code;
