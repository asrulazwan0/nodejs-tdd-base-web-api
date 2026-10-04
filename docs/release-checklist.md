# Release readiness

Status: implementation and verification in progress. No stable release is claimed until the exact candidate and publication gates have evidence.

- [x] Reproduced defects covered by regression tests; all unit/HTTP/MySQL checks pass.
- [x] Native install/type/lint/format/build/startup/smoke/shutdown verified on Linux.
- [ ] Windows checkout install/quality/tests/build/native HTTP verified with Windows Node.
- [ ] Docker development reload, isolated tests and production migration/readiness/smoke verified.
- [x] Coverage includes application source and enforced thresholds pass.
- [ ] Dependency audit and secret/readiness review pass or have explicit dated limits.
- [x] OpenAPI/Postman/docs match implemented behavior; TDD guide demonstrates test-first extension.
- [ ] License/metadata/runtime image agree; source/template excludes private tooling and secrets.
- [ ] Clean archive adoption passes against an isolated database.
- [ ] Required exact-candidate GitHub CI is green.
- [ ] Repository release/template/security settings verified.
- [ ] Tag/archive/GitHub source release published and verified.

[Verification evidence](verification-evidence.md) records commands, revisions and limitations. Both local checkouts must contain the intended source; preserved local environment/agent files are not release assets. Existing production/development databases are never reset by verification.
