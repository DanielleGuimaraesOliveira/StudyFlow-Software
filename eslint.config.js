import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import jestPlugin from 'eslint-plugin-jest'

export default [
  /**
   * 🔹 Arquivos e pastas ignoradas
   */
  {
    ignores: ['node_modules/**', 'build/**', 'dist/**', 'coverage/**'],
  },

  /**
   * 🔹 JavaScript (JS / JSX)
   */
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },

  /**
   * 🔹 TypeScript (TS / TSX)
   */
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,

      // Usa a versão do TS em vez da do JS
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',

      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },

  /**
   * 🔹 Testes (Jest)
   */
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    plugins: {
      jest: jestPlugin,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,

      // Em testes, variáveis não usadas são comuns
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',

      // Jest define essas globais, então não faz sentido validar
      'no-undef': 'off',
    },
  },
]
