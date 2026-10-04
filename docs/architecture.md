# Layered architecture

Requests pass through shared correlation/security/body middleware into a controller, a service and a repository. The controller owns HTTP transport. The service validates the operation, normalizes inputs and maps missing profiles into expected API errors. The repository interface describes persistence; the MySQL implementation owns SQL and translates uniqueness violations.

`createApp` accepts explicit dependencies. `UserService` accepts `IUserRepository` in its constructor. Runtime supplies `UserRepository`; unit/HTTP tests supply a controlled repository. There is one app composition path, no globally mocked dependency container, and no separate test-only Express app.

`createDataSource` constructs a disconnected MySQL data source. `src/index.ts` connects, checks pending migrations, composes dependencies and starts the listener. Imports do not connect to the database or register signal handlers. `src/server.ts` drains HTTP before database close and bounds shutdown duration.

The initial migration creates only the documented profile table on an empty schema. Production and development both use migrations; automatic synchronization is disabled. Names and normalized emails are validated before persistence, and database uniqueness remains the authority under concurrency.

The clean architecture starter additionally isolates domain models/use cases from persistence entities and framework dependencies. This project keeps a smaller service/repository structure for the CRUD/TDD example. Adopting TDD does not require choosing one architecture over the other.

To add a resource: define its input/output and OpenAPI contract, write a failing service or HTTP test, add a repository contract and service, implement the controller, then add a reviewed migration and real MySQL persistence tests. Wire it explicitly in `createApp` and runtime, and run all required checks.
