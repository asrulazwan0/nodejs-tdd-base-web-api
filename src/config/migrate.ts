import { loadConfig } from './environment';
import { createDataSource } from './database';

/** Production rollbacks are forward migrations; local reverts need an explicit opt-in. */
export async function migrate(args = process.argv.slice(2)): Promise<void> {
  const command = args[0];
  if (!['run', 'show', 'revert'].includes(command ?? ''))
    throw new Error('Expected run, show, or revert');
  const config = loadConfig();
  if (
    command === 'revert' &&
    (config.NODE_ENV === 'production' || !args.includes('--allow-destructive'))
  ) {
    throw new Error('Revert requires --allow-destructive and a non-production environment');
  }
  const db = createDataSource(config);
  await db.initialize();
  try {
    if (command === 'run') await db.runMigrations();
    else if (command === 'revert') await db.undoLastMigration();
    else console.info((await db.showMigrations()) ? 'Pending migrations' : 'No pending migrations');
  } finally {
    await db.destroy();
  }
}
if (require.main === module) {
  migrate().catch(() => {
    console.error(
      'Migration failed; check configuration, database permissions and schema adoption',
    );
    process.exitCode = 1;
  });
}
