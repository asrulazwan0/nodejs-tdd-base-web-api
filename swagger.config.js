/**
 * Swagger JSDoc configuration
 * Defines the OpenAPI specification for the API
 */

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js TDD Web API Starter',
      version: '1.0.0',
      description: 'A clean, production-ready, TDD-first Node.js + TypeScript starter for RESTful web APIs',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server',
      },
    ],
  },
  apis: ['./src/routes/*.route.ts'], // Path to the route files containing JSDoc annotations
};

module.exports = options;