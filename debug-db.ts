import { AppDataSource } from './src/config/database';
import { UserRepository } from './src/repositories/UserRepository';
import { Container } from 'typedi';

async function testDbConnection() {
  try {
    console.log('Initializing data source...');
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // Register repository
    const userRepository = new UserRepository(AppDataSource);
    Container.set(UserRepository, userRepository);
    
    console.log('Repository registered');

    // Try to find all users
    console.log('Attempting to find all users...');
    const users = await userRepository.findAll();
    console.log('Users found:', users);

    await AppDataSource.destroy();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error:', error);
  }
}

testDbConnection();