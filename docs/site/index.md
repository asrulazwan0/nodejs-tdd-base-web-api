# Build your next API test-first

A TypeScript and Express starter with Jest, Supertest, MySQL, and a complete profile CRUD example. Start from **v{{version}}**, then grow your application through red → green → refactor.

## Start with the stable release

```sh
git clone --branch v{{version}} https://github.com/asrulazwan0/nodejs-tdd-base-web-api.git my-api
cd my-api
git switch -c my-project
npm ci
cp .env.example .env
```

In PowerShell, use `Copy-Item .env.example .env`. The release tag is a fixed application revision. GitHub's **Use this template** creates a repository from current `main`, which also includes ongoing documentation improvements.

Choose your workflow in the [quickstart](../../README.md). For native development, provision MySQL and update `.env` before running migrations. The full Docker stack provides the database and runs an explicit migration job before API startup.

| Workflow | Requirements                             | Start here                                             |
| -------- | ---------------------------------------- | ------------------------------------------------------ |
| Native   | Node.js 24, npm 11, MySQL 8.4            | [Native quickstart](../../README.md#native-quickstart) |
| Hybrid   | Node.js and npm locally; MySQL in Docker | [Docker workflows](../../README.md#docker)             |
| Docker   | Docker with Compose v2                   | [Docker workflows](../../README.md#docker)             |

## What you get

- **A complete example:** create, read, list, update, and delete profiles, with normalized emails, validated names, pagination, and duplicate-email handling.
- **Clear dependencies:** controllers call services, services use repository interfaces, and constructors receive explicit dependencies.
- **Three test boundaries:** unit tests for decisions, HTTP tests using the runtime application factory, and isolated real MySQL tests for persistence and migrations.
- **Runtime basics:** validated configuration, request IDs, structured logs, consistent errors, liveness/readiness checks, and bounded shutdown.
- **Native and Docker workflows:** source reload, compiled startup, a non-root production image, and automated cross-platform checks.

## Learn by extending the example

Follow the [test-first exercise](../tdd.md), read [architecture](../architecture.md), and use the [API reference](api.md). The reference is generated from the authoritative OpenAPI contract and includes request schemas, pagination bounds, path parameters, and status codes.

The example stores profiles and has no authentication or authorization. Add an access policy appropriate to your application before exposing profile operations. See [operations](../operations.md) for database setup and deployment, and the [security policy](../../SECURITY.md) for reporting vulnerabilities.

## Choose your foundation

This starter emphasizes test-first development with MySQL and Jest. The [clean architecture starter](https://asrulazwan0.github.io/node-ts-clean-api-base/) uses PostgreSQL and Vitest with domain/application/infrastructure layers. TDD and clean architecture can be used together; choose the example and workflow that best fit your project.

## Release and verification

[v{{version}}](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/releases/tag/v{{version}}) is the stable source release. Read the [changelog](../../CHANGELOG.md), [verification evidence](../verification-evidence.md), and [release checklist](../release-checklist.md) for the completed application checks. This website presents documentation from `main`; it does not host the API or change existing release archives.

Licensed under [MIT](../../LICENSE).
