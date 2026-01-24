/**
 * Script to generate OpenAPI documentation
 */

const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');

const options = {
  definition: {
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

const specs = swaggerJsdoc(options);

// Write the generated documentation to a file
fs.writeFileSync('./openapi.json', JSON.stringify(specs, null, 2));

console.log('OpenAPI documentation generated successfully!');