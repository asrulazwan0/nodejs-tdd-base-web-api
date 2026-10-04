# Node.js TDD Web API Starter

A small, test-first TypeScript and Express API foundation with Jest, Supertest, MySQL 8.4 and TypeORM. Start natively or in Docker. This is a source/template repository, not an npm package.

Verified stable baseline: [v1.0.0](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/releases/tag/v1.0.0). See [release evidence](docs/verification-evidence.md) for the exact source, checks and supported workflows.

The complete profile CRUD example demonstrates controllers → services → repositories. Explicit constructor dependencies make unit tests small; HTTP tests construct the same application as the running server; real MySQL tests prove migrations, uniqueness races and persistence. No global mocks or separate test app are required.

This example has no authentication or authorization. Profiles are not login accounts. Add your own access policy before exposing profile operations in a consuming application.

## Which starter?

|           | This TDD starter                                | Clean architecture starter                            |
| --------- | ----------------------------------------------- | ----------------------------------------------------- |
| Focus     | Learn and extend through red → green → refactor | Keep business rules independent of framework adapters |
| Structure | Controllers, services, repositories, entities   | Domain, application, infrastructure                   |
| Database  | MySQL 8.4                                       | PostgreSQL 16                                         |
| Tests     | Jest + Supertest                                | Vitest + Supertest                                    |
| Injection | Explicit constructor dependencies               | Awilix                                                |
| Example   | Profile create/read/list/update/delete          | Profile creation                                      |

TDD and clean architecture can be used together. Both projects require meaningful tests, explicit migrations, native/Docker workflows, and release evidence. See [the TDD guide](docs/tdd.md) and [architecture](docs/architecture.md).

## Native quickstart

Requirements: Node.js 24, npm 11, and a reachable MySQL 8.4 server. Provision a separate application database and application role first; see [database setup](docs/operations.md). Docker is optional.

```sh
git clone --branch v1.0.0 https://github.com/asrulazwan0/nodejs-tdd-base-web-api.git
cd nodejs-tdd-base-web-api
git switch -c my-api
npm ci
cp .env.example .env
```

This starts a work branch from the fixed release. If you already cloned the repository, run the install/setup commands inside that checkout. GitHub's **Use this template** starts from current main.

In PowerShell, use `Copy-Item .env.example .env`. Edit `.env` to select your database and credentials. Environment variables supplied by your shell take precedence. The application does not create databases, synchronize schemas, or run migrations automatically.

```sh
npm run migration:run
npm run dev
```

Development reloads source changes. In another terminal, check `http://127.0.0.1:3000/health/ready` and `http://127.0.0.1:3000/api-docs/`.

```sh
curl -X POST http://127.0.0.1:3000/users -H 'Content-Type: application/json' -d '{"email":"profile@example.test","firstName":"Example","lastName":"Profile"}'
```

PowerShell users can send the same JSON with `Invoke-RestMethod -Method Post -Uri http://127.0.0.1:3000/users -ContentType application/json -Body '{"email":"profile@example.test","firstName":"Example","lastName":"Profile"}'`.

For a compiled run, stop development first:

```sh
npm run build
npm run migration:run:prod
npm start
```

Set `NODE_ENV=production` in `.env` or your deployment environment for production. `npm start` starts the compiled app at `dist/index.js`. Migrations must complete before startup. The listener binds to `127.0.0.1` by default; set `HOST=0.0.0.0` where container or deployment networking requires it.

## Docker

The examples use local-only credentials and preserve database data on ordinary shutdown. Use one API workflow at a time on the default port.

```sh
# MySQL only, with a native API
# Set DB_PORT in .env.example or pass a different Compose env file if 3306 is occupied.
docker compose --env-file .env.example up -d db

# Entire production reference stack, including an explicit migration job
docker compose --env-file .env.example up --build --wait

# Entire development stack, with source reload
docker compose --env-file .env.example -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Stop the same stack with `docker compose --env-file .env.example down`; include both `-f` options for development. Do not add `--volumes` unless you intend to delete its data. MySQL is published only on the host loopback address. The production image runs as a non-root user and includes the application license.

## Tests and quality

Unit and HTTP tests need no database:

```sh
npm test
npm run test:watch
npm run check
```

Run full coverage and real MySQL tests in a unique disposable Docker project:

```sh
npm run test:docker
```

Alternatively, create a separate database named with an `_test` suffix, copy `.env.test.example` to `.env.test`, and set the explicit credentials and reset opt-in. Tests delete rows in that selected database. They refuse a missing opt-in, a non-test name, or the current application database.

```sh
npm run test:integration
npm run test:coverage
```

Coverage includes all application source. Thresholds are 80% statements/lines/functions and 70% branches. Integration tests establish MySQL behavior; a fake repository cannot prove SQL constraints or migrations. Run `npm run audit` for the dependency gate.

## API contract

[openapi.json](openapi.json) is authoritative. `GET /openapi.json` serves it; `/api-docs/` provides Swagger UI. `npm run docs:generate` derives the checked-in Postman collection.

Successful responses retain direct profile objects or arrays. Errors contain `error`, `code`, and `requestId`; validation errors also contain `details`. Creation returns 201, deletion 204, invalid input 400, missing profiles 404, email conflicts 409, oversized bodies 413, and rate limits 429. Unexpected failures return generic 500 JSON.

Emails are trimmed and lowercased. Names are trimmed, contain 1–50 characters, and reject control characters. Updates require at least one known field and return the complete profile. Profile IDs must be UUIDs. Listing returns at most 100 profiles; use `limit` and `offset` for pagination.

Liveness is `/health/live` (also `/health`); readiness is `/health/ready`. CORS is disabled unless `CORS_ORIGIN` lists allowed origins. Rate limits use process-local memory; distributed deployments need an appropriate shared limiter. `TRUST_PROXY_HOPS` must match your actual proxy topology.

## Make it your project

Update package identity, repository/homepage/bugs links, docs and changelog after cloning or using the template. Keep the MIT notice. Follow [contributing](CONTRIBUTING.md), [security](SECURITY.md), and [operations](docs/operations.md). [Release readiness](docs/release-checklist.md) records the completed publication gates.

Licensed under [MIT](LICENSE).
