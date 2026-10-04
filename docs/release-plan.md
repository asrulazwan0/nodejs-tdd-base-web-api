# First verified source release

Scope: a small TDD-first TypeScript/Express/MySQL/Jest profile CRUD starter, verified in native and Docker workflows. This is source/template distribution; no npm package, registry image or hosted application is implied.

Status: completed on 2026-10-04. [Stable v1.0.0](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/releases/tag/v1.0.0) retains the package's existing version and aligns the MIT metadata with the existing MIT license text.

## Publication gates

1. Complete [the checklist](release-checklist.md) and review [verification evidence](verification-evidence.md).
2. Require all seven candidate CI checks: Linux/Windows/macOS native checks, MySQL/coverage/native smoke, container tests/production archive adoption, development source reload, and secret scan.
3. Prepare the exact main merge result and rerun required CI; verify a fresh exact-commit archive.
4. Verify template/private-reporting/branch-protection settings appropriate to the repository. Settings must be inspected, never inferred from configuration files.
5. Tag the verified commit `v1.0.0`, publish accurate GitHub source-release notes, and verify tag/release/archive identity.
6. Update both local checkouts and record cleanup/limits without moving the published tag.

## Execution record

[PR #1](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/pull/1) merged through normal branch protection after all seven [final candidate checks](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/actions/runs/37193565898) passed. The exact main merge result `df0279a0c60b2fdacb2540d6bc4b6b604ef6a590` also passed all seven [main checks](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/actions/runs/37193731011).

Fresh exact-commit and annotated-tag archives passed installation, quality checks, dependency audit and compiled native migration/startup/HTTP smoke against an isolated MySQL schema. All 67 tracked files matched the release commit, including executable bits. The published source archive matched the verified tag download byte-for-byte.

The annotated `v1.0.0` tag resolves to that merge commit. The GitHub release was published at `2026-10-04T10:06:53Z`; readback confirmed it is stable, not a draft, and the latest release. Follow-up completion documentation does not move this tag. [Verification evidence](verification-evidence.md) records hashes and final results.

Verification removed only the disposable test containers and volumes it created. The existing Windows clone and Linux checkout received the release source; local Windows environment configuration was preserved during release verification. Repository template/private vulnerability reporting and strict seven-check main protection were read back successfully.

## Released capabilities

- Working TypeScript/Express profile CRUD, MySQL migrations, and native/Docker quickstarts.
- Jest test-first contributor workflow with runnable red/green/refactor example and real database acceptance checks.
- Shared application composition, explicit dependencies, normalized validation, preserved partial-update fields, conflict mapping, and safe JSON errors.
- Liveness/readiness, Pino correlation logging, rate limiting, configurable CORS/proxy behavior, and bounded shutdown.
- Node.js 24/npm 11/MySQL 8.4 baseline, zero-finding dependency audit, and full-source coverage thresholds.

Limits: unauthenticated example; process-local limiter; existing synchronized schemas require reviewed adoption; no native macOS MySQL installation/runtime is claimed; Windows process termination is not POSIX graceful-signal verification.
