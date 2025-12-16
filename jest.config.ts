import type { Config } from 'jest'

const config: Config = {
  // Usa ts-jest para TypeScript
  preset: 'ts-jest',

  // Ambiente de testes (Node para backend)
  testEnvironment: 'node',

  // Onde o Jest vai procurar testes
  roots: ['<rootDir>/Shared', '<rootDir>/Api', '<rootDir>/Web'],

  // Padrão de arquivos de teste
  testMatch: ['**/__tests__/**/*.spec.ts', '**/?(*.)+(spec|test).ts'],

  // Suporte a path aliases (ex: @modules, @shared)
  moduleNameMapper: {
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },

  // Limpa mocks automaticamente
  clearMocks: true,
  restoreMocks: true,

  // Coleta de cobertura
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.controller.ts',
    '!src/**/*.routes.ts',
    '!src/**/*.dto.ts',
    '!src/**/index.ts',
    '!src/server.ts',
    '!src/app.ts',
  ],

  // Relatórios de cobertura
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],

  // Antes de rodar os testes
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Evita que testes lentos travem o CI
  testTimeout: 10000,
}

export default config
