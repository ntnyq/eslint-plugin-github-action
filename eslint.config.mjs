// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  ignores: ['**/tests/fixtures'],
  svgo: true,
  eslintPlugin: {
    overrides: {
      'eslint-plugin/require-meta-default-options': 'off',
    },
  },
  test: {
    vitest: false,
  },
  yml: {
    overrides: {
      'yml/no-empty-document': 'off',
    },
  },
})
