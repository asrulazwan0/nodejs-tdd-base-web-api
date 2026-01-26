/**
 * Main application entry point
 * Sets up the Express app with middleware and routes
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { useContainer } from 'typeorm';
import { Container } from 'typedi';
import { AppDataSource } from './config/database';
import { UserRepository } from './repositories/UserRepository';

// Load environment variables
dotenv.config();

// Import routes
import { healthRouter } from './routes/health.route';
import { userRouter } from './routes/user.route';
import swaggerOptions from '../swagger.config';

// Tell TypeORM to use the global container
useContainer(Container);

// Initialize the app
const app = express();

// Generate Swagger docs
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.info('SIGTERM signal received: closing DB connections');
  await AppDataSource.destroy();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;

// Function to initialize database connection with retry logic and start server only after success
async function initializeDatabaseWithRetry(maxRetries: number, delayMs: number) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await AppDataSource.initialize();
      console.log('Data Source has been initialized!');

      // Register repositories in the container
      Container.set(UserRepository, new UserRepository(AppDataSource));

      // Start the server only after database initialization is successful
      if (require.main === module) {
        // Only start the server if this file is run directly
        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
          console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
        });
      }
      return;
    } catch (err) {
      console.error(`Database initialization failed (attempt ${attempt}/${maxRetries}):`, err);

      if (attempt === maxRetries) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

// Initialize database connection with retry logic and start server only after success
initializeDatabaseWithRetry(10, 3000); // Retry up to 10 times with 3-second delays

export { app };
