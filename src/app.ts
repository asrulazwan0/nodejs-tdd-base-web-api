import 'reflect-metadata';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { randomUUID } from 'node:crypto';
import { ZodError } from 'zod';
import type { Logger } from 'pino';
import type { IUserRepository } from './repositories/IUserRepository';
import type { Config } from './config/environment';
import { UserService } from './services/user.service';
import { createUserRouter } from './controllers/user.controller';
import { ApiError } from './errors';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface AppDependencies {
  users: IUserRepository;
  config: Config;
  logger: Logger;
  isReady: () => Promise<boolean>;
}

/** Construct the same app in tests and runtime without starting connections or listeners. */
export function createApp({ users, config, logger, isReady }: AppDependencies): express.Express {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.TRUST_PROXY_HOPS);
  app.use(helmet());
  app.use(
    cors({
      origin: config.CORS_ORIGIN
        ? config.CORS_ORIGIN.split(',').map((origin) => origin.trim())
        : false,
    }),
  );
  app.use((req, res, next) => {
    const provided = req.get('x-request-id');
    const requestId = provided && /^[a-zA-Z0-9_-]{1,64}$/.test(provided) ? provided : randomUUID();
    res.locals.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    const start = performance.now();
    res.on('finish', () => {
      // Only configured route labels; no URL, body, headers, SQL parameters or error objects.
      const localPattern: unknown = req.route?.path;
      const route =
        typeof localPattern === 'string'
          ? localPattern === '/'
            ? '/users'
            : localPattern.startsWith('/health') || localPattern.startsWith('/api')
              ? localPattern
              : `/users${localPattern}`
          : 'unmatched';
      logger.info(
        {
          requestId,
          method: req.method,
          route,
          status: res.statusCode,
          durationMs: Math.round(performance.now() - start),
        },
        'request',
      );
    });
    next();
  });
  app.get(['/health', '/health/live'], (_req, res) => {
    res.json({ status: 'OK' });
  });
  app.get('/health/ready', async (_req, res) => {
    let ready = false;
    try {
      ready = await isReady();
    } catch {
      /* Do not expose database failures. */
    }
    res.status(ready ? 200 : 503).json({ status: ready ? 'OK' : 'UNAVAILABLE' });
  });
  const spec: unknown = JSON.parse(readFileSync(resolve(__dirname, '../openapi.json'), 'utf8'));
  app.get('/openapi.json', (_req, res) => {
    res.json(spec);
  });
  app.use(
    '/api-docs',
    helmet({ contentSecurityPolicy: { directives: { scriptSrc: ["'self'", "'unsafe-inline'"] } } }),
    swaggerUi.serve,
    swaggerUi.setup(spec as Record<string, unknown>),
  );
  app.use(
    rateLimit({
      windowMs: 60000,
      limit: config.RATE_LIMIT_MAX,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      handler: (_req, _res, next) => next(new ApiError(429, 'RATE_LIMITED', 'Too many requests')),
    }),
  );
  app.use(express.json({ limit: '16kb', strict: true }));
  app.use('/users', createUserRouter(new UserService(users)));
  app.use((_req, _res, next) => {
    next(new ApiError(404, 'NOT_FOUND', 'Route not found'));
  });
  const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
    if (res.headersSent) {
      _next(error);
      return;
    }
    const requestId: unknown = res.locals.requestId;
    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
        requestId,
      });
      return;
    }
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message, code: error.code, requestId });
      return;
    }
    const status =
      typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;
    if (status === 400 || status === 413 || status === 415) {
      res.status(status).json({
        error: status === 413 ? 'Request body too large' : 'Invalid request body',
        code: 'INVALID_BODY',
        requestId,
      });
      return;
    }
    logger.error(
      { requestId, errorType: error instanceof Error ? error.name : 'UnknownError' },
      'request failed',
    );
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR', requestId });
  };
  app.use(errorHandler);
  return app;
}
