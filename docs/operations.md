# Database and operation

## Native MySQL provisioning

Use MySQL 8.4. A DBA/operator can run the following for a **new local development database**; replace credentials before using any real deployment:

```sql
CREATE DATABASE tdd_api CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'tdd_app'@'localhost' IDENTIFIED BY 'local-only-change-me';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES ON tdd_api.* TO 'tdd_app'@'localhost';
```

For Docker, Compose creates its local database/account. For remote MySQL, scope the user host appropriately. Production migration and runtime roles can be separated by your deployment policy; never grant global privileges just to run this example.

Configure `.env`, run `npm run migration:show`, then `npm run migration:run`. Build with `npm run build`; compiled migrations use `npm run migration:run:prod`. Deploy only after migration completion. Run one migrator at a time.

## Existing auto-synchronized database

The initial migration deliberately refuses an existing `users` table. Back up and inspect the actual schema, email normalization/collisions, lengths, timestamps and constraints. Write/review an adoption migration and baseline record appropriate to that schema. Do not drop the table or mark the initial migration applied without proving equivalence. The starter does not migrate an unknown existing database automatically.

## Recovery

MySQL DDL may commit implicitly; a failed migration is not proof that no schema change occurred. Inspect schema and migration history before retrying. Keep backups and test restores. Production corrections use new forward migrations.

Local rollback is `npm run migration:revert -- --allow-destructive`. It is refused in production. The initial rollback drops profiles; use it only on disposable/local data you intend to delete.

## Isolated tests

Use `npm run test:docker` for a unique project with a temporary MySQL volume and cleanup after both pass and failure. The wrapper returns the test exit status and reports cleanup failures.

For an external disposable server, create a database/account such as `tdd_api_test`, set every `TEST_DB_*` variable in `.env.test`, and set `ALLOW_TEST_DATABASE_RESET=true`. The name must end `_test` and must differ from `DB_NAME`. Tests migrate, delete rows between cases, and exercise revert/reapply. Do not supply application or production credentials.

## Deployment configuration

The reference image binds all container interfaces, runs as `node`, includes the license, and exposes readiness. Supply your own credentials, TLS, network policy, backups, CORS allowlist and authorization. The example limiter is process-local and the API has no authentication. Trust only the actual number of reverse proxies; `TRUST_PROXY_HOPS=0` is the default.

Stop the listener with SIGTERM/SIGINT. It stops accepting requests, drains in-flight HTTP, then closes MySQL. The configured timeout bounds the whole shutdown; failure exits nonzero. Container orchestration should allow a grace period longer than that timeout. Windows native processes can be stopped by the verification endpoint-independent process tooling; POSIX signal behavior is verified separately.

## Troubleshooting

- `Startup failed`: validate `.env`, confirm MySQL reachability, run pending migrations, and check whether the listener port is free. Failure logs intentionally omit credentials/driver values.
- `Existing users table`: follow the reviewed adoption path above.
- Test guard failure: supply a separate `_test` database, all test credentials and explicit reset opt-in.
- Port conflict: select another `PORT`/`DB_PORT`; do not stop another project's services.
- Format differences across Windows/Linux: `.gitattributes` fixes text to LF. Use the supported formatter and avoid checking in generated `dist`, test output or personal agent files.
