import { TestDataSource } from './config/test.database';
import { Container } from 'typedi';
import { UserRepository } from './repositories/UserRepository';

// Simple test to check if database connection works
async function testConnection() {
  try {
    await TestDataSource.initialize();
    console.log('Database connected successfully');
    
    // Register repository
    Container.set(UserRepository, new UserRepository(TestDataSource));
    console.log('Repository registered');
    
    await TestDataSource.destroy();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection();