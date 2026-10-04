# Release readiness

Status: complete. [Stable v1.0.0](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/releases/tag/v1.0.0) was published on 2026-10-04 from `df0279a0c60b2fdacb2540d6bc4b6b604ef6a590` after all seven [exact-main CI checks](https://github.com/asrulazwan0/nodejs-tdd-base-web-api/actions/runs/37193731011) passed. This is a source/template release.

- [x] Reproduced defects covered by regression tests; all unit/HTTP/MySQL checks pass.
- [x] Native install/type/lint/format/build/startup/smoke/shutdown verified on Linux.
- [x] Windows checkout install/quality/tests/build/native HTTP verified with Windows Node.
- [x] Docker development reload, isolated tests and production migration/readiness/smoke verified.
- [x] Coverage includes application source and enforced thresholds pass.
- [x] Dependency audit and secret/readiness review pass or have explicit dated limits.
- [x] OpenAPI/Postman/docs match implemented behavior; TDD guide demonstrates test-first extension.
- [x] License/metadata/runtime image agree; source/template excludes private tooling and secrets.
- [x] Clean archive adoption passes against an isolated database.
- [x] Required exact-candidate GitHub CI is green.
- [x] Repository release/template/security settings verified.
- [x] Tag/archive/GitHub source release published and verified.

[Verification evidence](verification-evidence.md) records commands, revisions and limitations. Both local checkouts must contain the intended source; local environment configuration is excluded from release assets. Existing production/development databases are never reset by verification.
