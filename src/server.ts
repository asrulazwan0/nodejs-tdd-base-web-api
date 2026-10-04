import type { Express } from 'express';
import { createServer, type Server } from 'node:http';
import type { Config } from './config/environment';

export interface RunningServer {
  server: Server;
  shutdown: () => Promise<void>;
}
/** Drain HTTP before database close; repeated shutdown requests share one promise. */
export async function listen(
  app: Express,
  config: Config,
  closeDatabase: () => Promise<void>,
): Promise<RunningServer> {
  const server = await new Promise<Server>((resolve, reject) => {
    const value = createServer(app);
    value.once('error', reject);
    value.listen(config.PORT, config.HOST, () => resolve(value));
  });
  let shutdownPromise: Promise<void> | undefined;
  server.on('request', (req, res) => {
    res.on('finish', () => {
      if (shutdownPromise) req.socket.end();
    });
  });
  const shutdown = (): Promise<void> => {
    if (shutdownPromise) return shutdownPromise;
    shutdownPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        server.closeAllConnections();
        reject(new Error('Shutdown timeout'));
      }, config.SHUTDOWN_TIMEOUT_MS);
      server.close((error) => {
        if (error) {
          clearTimeout(timeout);
          reject(error);
          return;
        }
        closeDatabase().then(
          () => {
            clearTimeout(timeout);
            resolve();
          },
          (error: unknown) => {
            clearTimeout(timeout);
            reject(error);
          },
        );
      });
    });
    return shutdownPromise;
  };
  return { server, shutdown };
}
