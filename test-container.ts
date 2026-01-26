import { AppDataSource } from './src/config/database';
import { UserRepository } from './src/repositories/UserRepository';
import { Container } from 'typedi';
import { useContainer } from 'typeorm';

// Tell TypeORM to use the global container
useContainer(Container);

async function testRepoInContainer() {
  try {
    console.log('Initializing data source...');
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // Register repository in the container (same as in app.ts)
    const userRepositoryInstance = new UserRepository(AppDataSource);
    Container.set(UserRepository, userRepositoryInstance);
    console.log('Repository registered in container');

    // Now try getting it from the container (same as in service)
    const repoFromContainer = Container.get(UserRepository);
    console.log('Repository retrieved from container:', !!repoFromContainer);

    // Try to find all users
    console.log('Attempting to find all users...');
    const users = await repoFromContainer.findAll();
    console.log('Users found:', users);

    await AppDataSource.destroy();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error:', error);
  }
}

testRepoInContainer();