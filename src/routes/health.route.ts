/**
 * Health check route
 * Provides basic health status of the application
 */

import express from 'express';
import { Request, Response } from 'express';

export const healthRouter = express.Router();

/**
 * GET /health
 * Returns the health status of the application
 */
healthRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
