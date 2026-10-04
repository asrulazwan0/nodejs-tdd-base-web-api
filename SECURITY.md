# Security policy

This source/template API supplies an unauthenticated user-profile example. Implement authorization, transport security, deployment credentials and network policy in your consuming project.

Do not publish real secrets or vulnerability reproduction payloads in public issues. Use the repository's private vulnerability reporting feature when it is enabled; otherwise contact the maintainer privately before disclosing details. Private reporting availability is an external repository setting and is recorded in the release checklist.

`npm run audit` must pass before release; known exceptions, if any, require a dated record with expiry and a concrete mitigation. No audit exception is implied by this policy.

Request logs omit bodies, raw URLs, query strings, headers, SQL and raw exception values. Error responses do not expose database details. Do not replace this with whole-request or driver-error serialization.

Use a separate MySQL account/database for tests. Test deletion requires explicit credentials, a `_test` name, and reset opt-in. Keep backup/restore and forward migration procedures under your deployment policy.

The supported baseline is Node.js 24, npm 11 and MySQL 8.4. Dependency maintenance and exact candidate CI must be verified for each release.
