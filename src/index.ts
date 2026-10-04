import { createApp } from './app';
import { loadConfig } from './config/environment';
import { createLogger } from './logging';
import { createDataSource } from './config/database';
import { UserRepository } from './repositories/UserRepository';
import { listen, type RunningServer } from './server';

/** Executable composition; imports never open a database or listener. */
export async function start(): Promise<RunningServer> {
  const config = loadConfig();
  const logger = createLogger(config);
  const db = createDataSource(config);
  let stopping = false;
  try {
    await db.initialize();
    if (await db.showMigrations()) throw new Error('Apply pending migrations before startup');
    const app = createApp({
      config,
      logger,
      users: new UserRepository(db),
      isReady: async () => {
        if (stopping || !db.isInitialized) return false;
        await db.query('SELECT 1');
        return true;
      },
    });
    const runtime = await listen(app, config, async () => {
      await db.destroy();
    });
    logger.info({ port: config.PORT }, 'listening');
    const shutdown = (): void => {
      stopping = true;
      runtime.shutdown().then(
        () => logger.info('shutdown complete'),
        () => {
          logger.error('shutdown failed');
          process.exit(1);
        },
      );
    };
    process.once('SIGTERM', shutdown);
    process.once('SIGINT', shutdown);
    return runtime;
  } catch {
    logger.error('Startup failed; verify configuration, migrations and database availability');
    if (db.isInitialized) await db.destroy();
    throw new Error('Startup failed');
  }
}
if (require.main === module) {
  start().catch(() => {
    process.exitCode = 1;
  });
}
