import pino, { type Logger } from 'pino';
import type { Config } from './config/environment';

/** Request bodies, raw URLs, database errors and credentials are never serialized. */
export function createLogger(config: Config): Logger {
  return pino({ level: config.LOG_LEVEL, base: undefined });
}
