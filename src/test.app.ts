/**
 * Test application file
 * Sets up the Express app for testing with mocked database
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { useContainer } from 'typeorm';
import { Container } from 'typedi';

// Import routes
import { healthRouter } from './routes/health.route';
import { userRouter } from './routes/user.route';

// Tell TypeORM to use the global container
useContainer(Container);

// Initialize the app
const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health check route
app.use('/health', healthRouter);

// User routes
app.use('/users', userRouter);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export { app };