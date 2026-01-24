# Node.js TDD Web API Starter

A clean, production-ready, TDD-first Node.js + TypeScript starter for RESTful web APIs. Designed for developers to fork, learn, and build upon.

## Tech Stack

- Runtime: Node.js 20+
- Language: TypeScript (strict mode)
- Framework: Express (minimal, no bloat)
- Testing: Jest + Supertest (100% test coverage goal)
- Linting: ESLint + Prettier
- Logging: Pino
- Validation: Zod
- Docs: OpenAPI 3.0 (Swagger UI optional)

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run tests:

```bash
npm test
```

3. Run development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Start development server with ts-node
- `npm run start` - Start production server
- `npm test` - Run tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly
- `npm run type-check` - Run TypeScript type checking

## TDD Workflow

Every feature must start with a failing test. Follow the Red → Green → Refactor cycle strictly. No business logic should be in route handlers—use the service layer instead.

## Project Structure

```
src/
├── app/           # Application entry point
├── controllers/   # Request handlers
├── domain/        # Business logic and entities
├── infrastructure/ # External integrations
├── middleware/    # Express middleware
├── routes/        # Route definitions
├── services/      # Business logic
├── types/         # Type definitions
├── utils/         # Utility functions
└── ...
tests/            # Test files
```
