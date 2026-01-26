// Setup file for Jest tests
import 'reflect-metadata';

// Mock the database initialization to prevent it from running during tests
jest.mock('../src/config/database', () => {
  const mockDataSource = {
    initialize: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn().mockResolvedValue(undefined),
    getRepository: jest.fn(),
  };

  return {
    AppDataSource: mockDataSource,
  };
});

// Mock typedi container methods that might trigger initialization
jest.mock('typedi', () => {
  const actualTypedi = jest.requireActual('typedi');
  return {
    ...actualTypedi,
    useContainer: jest.fn(),
    Container: {
      ...actualTypedi.Container,
      set: jest.fn(),
      get: jest.fn(),
    },
  };
});