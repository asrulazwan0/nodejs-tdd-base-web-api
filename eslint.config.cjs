const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const globals = require('globals');
module.exports = tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**', '.site/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.jest } } },
  { files: ['docs/site/*.js'], languageOptions: { globals: globals.browser } },
  { files: ['*.cjs'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
);
