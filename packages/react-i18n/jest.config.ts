import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

const { compilerOptions } = require('./tsconfig.json');

const config: Config = {
  verbose: true,

  preset: 'ts-jest',

  moduleFileExtensions: ['js', 'json', 'ts'],

  testRegex: 'src/__tests__/(.*).spec.ts',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  collectCoverageFrom: ['**/*.(t|j)s'],

  coverageDirectory: '../coverage',

  testEnvironment: 'node',

  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>',
    }),

    '@ts-chimera/(.*)': '<rootDir>/../$1/src',
  },
};

export default config;