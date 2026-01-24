import { DataSource } from 'typeorm';

export const TestDataSource = new DataSource({
  type: 'sqlite',  // Using SQLite for testing as it's lightweight and doesn't require a server
  database: ':memory:',  // In-memory database
  synchronize: true,  // Automatically synchronize schema in tests
  dropSchema: true,  // Drop schema before each test run
  entities: [`${__dirname}/../entities/*.{ts,js}`],
  logging: false,
});