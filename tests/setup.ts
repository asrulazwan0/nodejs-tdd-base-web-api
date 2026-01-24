// Jest setup file
// This file is run once before all tests

// Mock global objects if needed
global.console = {
  ...console,
  // Comment out to enable logs during tests
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
