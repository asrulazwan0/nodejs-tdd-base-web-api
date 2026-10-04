# Contributing

Use Node.js 24 and npm 11. Install with `npm ci`. Create a feature branch from `main`; target `main` with your pull request.

Follow [red → green → refactor](docs/tdd.md). A defect fix starts with a test reproducing observable behavior. For a feature, first define its API/service contract and add a failing test. Record the command and failing behavior in your PR, then implement the smallest complete change and refactor with tests passing.

Run `npm run check`, `npm run test:docker`, and `npm run audit`. Unit/HTTP tests run without a database. Database tests require a separate disposable MySQL `_test` database and explicit reset opt-in; never use development or production data. See `.env.test.example` and [operations](docs/operations.md).

Tests live under `tests/unit`, `tests/http`, and `tests/integration`. Use controlled repositories to test service decisions and the shared app factory to test transport behavior. Add real MySQL tests for migrations, uniqueness, timestamps and persistence semantics.

Update OpenAPI before changing observable API behavior. Regenerate the Postman collection with `npm run docs:generate`. Include migration and compatibility notes in the changelog. Do not modify a migration already applied to a released database.

Use the formatter and lint rules supplied by the repository. Keep source/template metadata, secrets and personal agent configuration out of commits. Keep changes reviewable and describe the resulting behavior, reproduction and verification in your PR.
