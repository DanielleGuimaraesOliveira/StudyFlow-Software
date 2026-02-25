import { createDefaultPreset } from 'ts-jest'

/* eslint-disable no-unused-vars */
const tsJestTransformCfg = createDefaultPreset().transform

/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  moduleNameMapper: {
    '^(\\.\\./?.+)\\.js$': '$1',
  },

  roots: ['<rootDir>/backend', '<rootDir>/Web'],

  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
}
