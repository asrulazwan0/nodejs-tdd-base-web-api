# Verification evidence

Prepared 2026-10-04. Work branch: `feat/verified-tdd-starter`.

## Baseline

Upstream commit `165dc6743a1a64a868c9e2084277a65f59008cf0` failed production startup (wrong compiled path), 9 of 24 original tests, lint (76 errors), formatting (30 files), and dependency audit (56 findings). Latest upstream CI also failed. No stable tags/releases were present.

Windows clone: `C:\Dev\Projects\nodejs-tdd-web-api-starter`; Linux clone: `/home/hyperzecter/projects/nodejs-tdd-base-web-api`. Original tracked Windows differences were CRLF-only in `.env.example`, `.gitignore` and `LICENSE`. The separate `C:\Dev\Projects\nodejs-tdd-base-web-api` directory is an empty initialized Git repository, not the source clone. Personal environment and untracked agent files are preserved.

## Red evidence

Before fixes, five targeted Jest tests ran with the actual repository and in-memory SQLite. All failed on the intended API behavior: incomplete partial-update response, duplicate 500 instead of 409, malformed HTML response, unknown-route failure, and accepted empty update. Local log: `/tmp/tdd-red-regressions.log`.

SQLite was then removed. Maintained unit/HTTP tests use controlled dependencies; MySQL integration proves actual schema and persistence. A real MySQL test additionally caught timestamp precision moving `updatedAt` backward on an update; the update query now uses microsecond database time.

## Final checks

Linux (Node 24.13.1/npm 11): `npm ci`, `npm run check` passed with 65 unit/HTTP tests; real MySQL 8.4.11 coverage passed all 77 tests (65 unit/HTTP, 12 integration). Coverage: 93.58% statements, 89.69% branches, 91.93% functions, 94.04% lines. No source coverage exclusions were added. `npm audit` reports zero findings, with no exceptions.

Compiled native migration/startup/CRUD/conflict/JSON-error/documentation smoke and graceful SIGTERM shutdown passed using the explicit disposable MySQL schema. Startup rejects pending migrations, unavailable databases and occupied ports. Shutdown tests prove HTTP drains before database close and a timeout bounds stuck cleanup.

Production Docker built from the checkout, migrated a fresh MySQL schema and became ready. Docker test/Windows/adoption/review/remote release gates are still being verified. Local logs include `/tmp/tdd-check.log`, `/tmp/tdd-coverage.log`, `/tmp/tdd-native.log`, `/tmp/tdd-final-audit.json`, `/tmp/tdd-production.log` and `/tmp/tdd-docker-tests.log`. Durable exact-candidate CI is required before a stable release.

The clean architecture starter also passed a fresh local `npm run check` with its 66 unit/30 HTTP tests; its released PostgreSQL/container verification remains recorded in that project's existing release evidence.
