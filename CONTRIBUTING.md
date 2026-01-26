# Contributing to Node.js TDD Web API Starter

First off, thanks for taking the time to contribute! All contributions are welcome and appreciated.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Pull Requests](#pull-requests)
- [Style Guides](#style-guides)

## Code of Conduct
This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/nodejs-tdd-web-api-starter.git`
3. Navigate to the project directory: `cd nodejs-tdd-web-api-starter`
4. Install dependencies: `npm install`
5. Create a `.env` file based on `.env.example`
6. Run the development server: `npm run dev`

## Development Workflow
1. Create a feature branch from `develop`: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Add tests for your changes (following TDD principles)
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Run type checking: `npm run type-check`
7. Commit your changes using conventional commits
8. Push to your fork
9. Create a pull request to the `develop` branch

## Testing
This project follows Test Driven Development (TDD) principles. Every feature must start with a failing test.

### Running Tests
- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Run tests with coverage: `npm run test:coverage`

### Test Structure
- Place route tests in `src/routes/__tests__/` or with the pattern `*.route.spec.ts`
- Place service tests in `src/services/__tests__/` or with the pattern `*.service.spec.ts`
- Place unit tests for utilities in `src/utils/__tests__/` or with the pattern `*.util.spec.ts`

## Pull Requests
1. Describe your changes in the pull request
2. Reference any related issues
3. Ensure all tests pass
4. Have someone review your code before merging
5. Squash commits if necessary

## Style Guides

### Git Commit Messages
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Style Guide
- Use TypeScript for all new code
- Follow the existing code style enforced by ESLint and Prettier
- Use meaningful variable and function names
- Document public functions and classes with JSDoc
- Use interfaces for object shapes
- Use enums for constants when appropriate

### Architecture
- Follow the existing layered architecture (controllers → services → repositories → entities)
- Keep controllers thin - they should only handle HTTP concerns
- Put business logic in services
- Keep services focused on a single responsibility
- Use repositories for data access operations

Thank you for contributing!