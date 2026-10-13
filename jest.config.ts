import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/features/**/*.{ts,tsx}', '!src/features/**/types.ts'],
  coveragePathIgnorePatterns: [
    '/src/features/assignments/AssignmentList.tsx',
    '/src/features/assignments/Statistics.tsx',
    '/src/features/assignments/pinStore.ts',
    '/src/features/assignments/useAssignments.ts',
  ],
  coverageThreshold: {
    './src/features/': { statements: 70 },
  },
};

export default config;
