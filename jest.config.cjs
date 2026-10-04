const project = (name) => ({
  displayName: name,
  testEnvironment: 'node',
  testMatch: [`<rootDir>/tests/${name}/**/*.test.ts`],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
  setupFiles: ['reflect-metadata'],
  testTimeout: 30000,
});
module.exports = {
  projects: ['unit', 'http', 'integration'].map(project),
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: { global: { statements: 80, branches: 70, functions: 80, lines: 80 } },
  coverageReporters: ['text', 'lcov', 'json-summary'],
};
