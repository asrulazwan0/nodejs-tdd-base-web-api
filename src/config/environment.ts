import { z } from 'zod';

const port = z.coerce.number().int().min(1).max(65535);
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: port.default(3000),
  HOST: z.string().min(1).default('127.0.0.1'),
  DB_HOST: z.string().min(1).default('127.0.0.1'),
  DB_PORT: port.default(3306),
  DB_USERNAME: z.string().min(1).default('tdd_app'),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .default('tdd_api'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  CORS_ORIGIN: z.string().default(''),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(10).default(0),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(100),
  SHUTDOWN_TIMEOUT_MS: z.coerce.number().int().min(100).max(60000).default(10000),
});
export type Config = z.infer<typeof schema>;

/** Validate once; do not include raw environment values in failures. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const result = schema.safeParse(env);
  if (!result.success) {
    throw new Error(
      `Invalid configuration: ${result.error.issues.map((issue) => issue.path.join('.')).join(', ')}`,
    );
  }
  return result.data;
}
