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

Candidate source: `29bc21ab61e8cd27792985e81da8ebf1f4f33351`; later commits record evidence and make the development reload acceptance durable in CI.

Windows Node 24.15.0/npm 11.12.1: native `npm ci`, `npm run check` (65 tests), and full MySQL coverage (77 tests, same percentages as Linux) passed in the existing Windows checkout. Its compiled migration/startup/real HTTP smoke passed using a separate disposable `windows_api_test` schema. POSIX graceful SIGTERM behavior is verified on Linux; Windows child termination is checked for cleanup, not claimed as POSIX signal delivery.

Production Docker built from the checkout, migrated a fresh MySQL schema, became ready and passed real HTTP CRUD/conflict/validation/JSON/docs smoke. Runtime UID is 1000. The exact license matches the source, and source/tests/environment/compiler files are excluded from the runtime. Docker isolated coverage passed all 77 tests and removed only its own stack. Development Docker migrated a fresh schema, passed smoke, observed an actual source edit over HTTP, and observed exact restoration/reload.

A fresh `git archive` extraction passed `npm ci`, `npm run check` and compiled native migration/startup/HTTP smoke. Local Gitleaks scanned all 17 candidate-history commits and found no leaks. Postman regeneration produces no diff.

Draft [PR #1](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/pull/1) makes the result reviewable. Initial [candidate CI](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/actions/runs/37192588151) was in progress when this evidence update was prepared; final CI/publication are separate gates. Local logs include `/tmp/tdd-check.log`, `/tmp/tdd-coverage.log`, `/tmp/tdd-native.log`, `/tmp/tdd-final-audit.json`, `/tmp/tdd-production.log` and `/tmp/tdd-docker-tests.log`. Durable exact-candidate CI is required before a stable release.

The clean architecture starter also passed a fresh local `npm run check` with its 66 unit/30 HTTP tests; its released PostgreSQL/container verification remains recorded in that project's existing release evidence.

## Final input review

Two additional unit regressions were confirmed red before fixes: C1 control characters in profile names and undefined-only direct service updates. They now reject before repository work. The final suite has 79 tests (67 unit/HTTP, 12 MySQL integration). Prior 77-test evidence above records the earlier verified candidate. Local red log: `/tmp/tdd-red-final-boundaries.log`.

All seven checks passed for [CI 37192783974](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/actions/runs/37192783974) at `dd38b52be479d0f83fe4aab31252f838be722a96`. The final input changes require their own exact-candidate CI before merge/publication.

Repository settings were read back: GitHub template enabled, private vulnerability reporting enabled, and strict main protection requires all seven CI contexts, enforces administrators, and prevents force pushes/deletions. Independent human approvals are not required in this sole-maintainer repository; merges must satisfy checks normally.
