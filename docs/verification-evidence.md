# Verification evidence

Completed 2026-10-04. Implementation branch: `feat/verified-tdd-starter`. Earlier candidate counts below are retained as historical evidence; the following release record is authoritative.

## Published v1.0.0

[Stable release](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/releases/tag/v1.0.0): published `2026-10-04T10:06:53Z`, release commit `df0279a0c60b2fdacb2540d6bc4b6b604ef6a590`, annotated tag object `771ed6b8e04b4dad234fdd1d082a956c98e97328`. Release/latest readback confirmed `isDraft: false`, `isPrerelease: false`, and the intended commit.

| Verification               | Final result                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Linux and native Windows   | Install, format, lint, types, 68 unit/HTTP tests and build passed; compiled migration/startup/real HTTP smoke passed      |
| Real MySQL 8.4.11          | 12 integration tests passed; combined suite: 80 tests                                                                     |
| Full-source coverage       | 93.20% statements, 85.85% branches, 91.93% functions, 93.62% lines; all thresholds passed                                 |
| Dependency audit           | Zero findings, no exceptions                                                                                              |
| Exact release CI           | All seven jobs passed on both the final PR source and the main release commit                                             |
| Release archive adoption   | Exact-commit and tag downloads passed clean installation, quality, audit and compiled native migration/startup/HTTP smoke |
| Clean architecture starter | Fresh quality check passed: 66 unit and 30 HTTP tests; existing released PostgreSQL/container evidence retained           |

Durable runs: [final PR CI 37193565898](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/actions/runs/37193565898), [exact main CI 37193731011](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/actions/runs/37193731011). The seven jobs cover Linux/Windows/macOS native quality, real MySQL/coverage/compiled smoke, isolated container tests and production adoption from the exact GitHub source archive, Docker development source reload, and secret scanning. [PR #1](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/pull/1) merged normally without bypassing protection.

The two local native runtime checks used disposable schemas in a Docker-supplied MySQL server. Native Windows MySQL installation is not claimed. Linux verifies graceful SIGTERM shutdown; Windows verifies child termination cleanup. macOS CI verifies installation/quality/tests/build, not a native MySQL runtime. Docker production verifies fresh-schema migration/readiness/HTTP behavior, non-root runtime and the application license; Docker development verifies actual source reload and restoration.

Archive identity: 67 tracked files match in content and executable bits. Exact-commit archive SHA-256: `e6a56fd9bfc9d40b1957463c646634cb29e92283e153a677779c63ee4069486e`. Annotated-tag archive SHA-256: `72c85f02c603f605dd3e719244658b8a6cb92a1d2b34fe85db4e2eb87f23beea`. A download after publication matched the verified tag archive byte-for-byte. The tag remains fixed when completion documentation changes main.

Local final logs: `/tmp/tdd-final-check.log`, `/tmp/tdd-final-coverage.log`, `/tmp/tdd-windows-final-check.log`, `/tmp/tdd-windows-final-coverage.log`, `/tmp/tdd-release-source-native.log`, `/tmp/tdd-tag-native.log`; archive manifest: `/tmp/tdd-v1.0.0-archive-manifest.json`. These local logs supplement the durable CI links. Verification containers and their own disposable volumes were removed; existing user databases and personal local configuration were preserved.

## Baseline

Upstream commit `165dc6743a1a64a868c9e2084277a65f59008cf0` failed production startup (wrong compiled path), 9 of 24 original tests, lint (76 errors), formatting (30 files), and dependency audit (56 findings). Latest upstream CI also failed. No stable tags/releases were present.

Windows clone: `C:\Dev\Projects\nodejs-tdd-web-api-starter`; Linux clone: `/home/hyperzecter/projects/nodejs-tdd-base-web-api`. Original tracked Windows differences were CRLF-only in `.env.example`, `.gitignore` and `LICENSE`. The separate `C:\Dev\Projects\nodejs-tdd-base-web-api` directory is an empty initialized Git repository, not the source clone. Local environment configuration was preserved during release verification.

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

Final source checks passed all 79 tests, including 12 real MySQL tests. Full-source coverage is 93.56% statements, 89.47% branches, 91.93% functions and 94.00% lines. The 80/70/80/80 thresholds remain unchanged. `npm run check` passed 67 unit/HTTP tests plus format/lint/types/build. Source fix commit: `3fe041d`.

Executable invalid-configuration startup was also reproduced red: it exited nonzero without reporting the configuration keys. The entry point now reports only the validated key names (never values) and has a subprocess regression. Final suite: 80 tests (68 unit/HTTP, 12 MySQL). Local red log: `/tmp/tdd-red-startup-config.log`. Earlier counts above are historical candidate evidence.
