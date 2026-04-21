import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/**', 'node_modules/**', 'src/database/seed-runner.ts']),

  // Базовые правила JavaScript
  eslint.configs.recommended,

  // Базовые правила TypeScript
  tseslint.configs.recommended,

  // Дополнительные конфигурации (опционально)
  tseslint.configs.strict,
  tseslint.configs.stylistic,

  // Кастомные настройки
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
);
