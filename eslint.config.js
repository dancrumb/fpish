import tsEslint from '@typescript-eslint/eslint-plugin'
import tsParse from '@typescript-eslint/parser'

export default [
  {
    files: ["**/*.ts"],
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/docs/**'
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 2019,
      sourceType: 'module',
      parser: tsParse
    },
    plugins: { '@typescript-eslint': tsEslint }
  }, {
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/no-shadow': ['error'],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_" }
      ],
      '@typescript-eslint/no-redeclare': 'error',
      'no-dupe-class-members': 'off',
      '@typescript-eslint/no-dupe-class-members': 'error',
      eqeqeq: ['error', 'smart'],
      'no-caller': 'error',
      'no-invalid-this': 'error',
      'no-new-wrappers': 'error',
      'no-shadow': 'off',
      'no-throw-literal': 'error',
      'no-unused-labels': 'error',
      'no-var': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      'no-redeclare': 'off'
    },
  }];
