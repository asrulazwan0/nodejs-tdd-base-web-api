# First verified source release

Scope: a small TDD-first TypeScript/Express/MySQL/Jest profile CRUD starter, verified in native and Docker workflows. This is source/template distribution; no npm package, registry image or hosted application is implied.

The package's existing `1.0.0` metadata has never been published as a verified release. The first candidate retains `1.0.0` and aligns the MIT metadata with the existing MIT license text.

## Publication gates

1. Complete [the checklist](release-checklist.md) and review [verification evidence](verification-evidence.md).
2. Require all seven candidate CI checks: Linux/Windows/macOS native checks, MySQL/coverage/native smoke, container tests/production archive adoption, development source reload, and secret scan.
3. Prepare the exact main merge result and rerun required CI; verify a fresh exact-commit archive.
4. Verify template/private-reporting/branch-protection settings appropriate to the repository. Settings must be inspected, never inferred from configuration files.
5. Tag the verified commit `v1.0.0`, publish accurate GitHub source-release notes, and verify tag/release/archive identity.
6. Update both local checkouts and record cleanup/limits without moving the published tag.

Merge/tag/release/settings changes are public repository actions beyond preparing the candidate. The draft PR and verified local candidate make those actions concrete and reviewable.

## Release notes prepared

- Working TypeScript/Express profile CRUD, MySQL migrations, and native/Docker quickstarts.
- Jest test-first contributor workflow with runnable red/green/refactor example and real database acceptance checks.
- Shared application composition, explicit dependencies, normalized validation, preserved partial-update fields, conflict mapping, and safe JSON errors.
- Liveness/readiness, Pino correlation logging, rate limiting, configurable CORS/proxy behavior, and bounded shutdown.
- Node.js 24/npm 11/MySQL 8.4 baseline, zero-finding dependency audit, and full-source coverage thresholds.

Limits: unauthenticated example; process-local limiter; existing synchronized schemas require reviewed adoption; no native macOS MySQL installation/runtime is claimed; Windows process termination is not POSIX graceful-signal verification.
