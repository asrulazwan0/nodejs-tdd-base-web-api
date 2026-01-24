import { TestDataSource } from './config/test.database';
import { Container } from 'typedi';
import { UserRepository } from './repositories/UserRepository';

// Initialize the test database and register the repository
export async function setupTestDatabase() {
  await TestDataSource.initialize();
  // Register repository in the container
  Container.set(UserRepository, new UserRepository(TestDataSource));
}

// Clean up the test database
export async function tearDownTestDatabase() {
  await TestDataSource.destroy();
}