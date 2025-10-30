import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ...js.configs.recommended,
    files: ['**/*.js'],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off'
    }
  }
];
