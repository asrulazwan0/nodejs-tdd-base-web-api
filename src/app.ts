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

// Load environment variables
dotenv.config();

// Import routes
import { healthRouter } from './routes/health.route';
import { userRouter } from './routes/user.route';
import swaggerOptions from '../swagger.config';

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

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  // Only start the server if this file is run directly
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
}

export { app };
