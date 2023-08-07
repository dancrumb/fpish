import type {JestConfigWithTsJest} from 'ts-jest';
import {defaults as tsjPreset} from 'ts-jest/presets';

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  transform: {
    ...tsjPreset.transform,
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/src/*.ts'],
  coverageReporters: ['html', 'lcov', 'cobertura'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  moduleDirectories: ['node_modules', '<module-directory>'],
};

export default jestConfig;
