import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import sonarjs from 'eslint-plugin-sonarjs';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results', 'src/api/generated']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      sonarjs.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ---------- TypeScript ----------
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',

      // ---------- React ----------
      'react/prop-types': 'off',
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/self-closing-comp': 'warn',
      'react/jsx-boolean-value': ['warn', 'never'],
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // ---------- Sonar ----------
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': ['warn', { threshold: 4 }],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/prefer-immediate-return': 'warn',
      'sonarjs/no-nested-conditional': 'warn',
      'sonarjs/todo-tag': 'warn',
      'sonarjs/function-return-type': 'off',
      'sonarjs/deprecation': 'warn',

      // ---------- SOLID / ساختار (مسئولیت واحد و سادگی) ----------
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 120, skipBlankLines: true, skipComments: true }],
      'max-params': ['warn', 4],
      'max-depth': ['warn', 3],
      complexity: ['warn', 12],
      'no-nested-ternary': 'warn',

      // ---------- عمومی ----------
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**', 'e2e/**', 'src/constant/mock/**'],
    rules: {
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/pseudo-random': 'off',
    },
  },
  {
    files: ['*.config.{js,ts}', 'e2e/**'],
    languageOptions: { globals: { ...globals.node } },
  },
  prettier,
]);
