# Changelog

## 1.0.0 — 2026-10-04

- Reject Unicode control characters and undefined-only service updates before repository work.
- Repair the compiled entry point, remove global container mocks, and share app construction between tests and runtime.
- Add regression-first coverage of complete partial-update responses, normalized-email conflicts, JSON errors and input boundaries.
- Supply explicit MySQL schema migrations, guarded test databases, uniqueness-race and persistence tests.
- Add native source reload, bounded shutdown, liveness/readiness, request correlation, safe Pino logging, configurable CORS/proxy and rate limiting.
- Separate Docker dependency/build/runtime stages, include the license, run non-root and isolate test stacks.
- Align the Node.js 24/npm 11 baseline, dependencies, MIT metadata, quality checks, OpenAPI, Postman examples and TDD documentation.

The existing `1.0.0` package metadata predates verification. It does not represent a previously published stable release.
