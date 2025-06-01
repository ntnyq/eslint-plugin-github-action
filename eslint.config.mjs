// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  svgo: true,
  eslintPlugin: {
    overrides: {
      'eslint-plugin/require-meta-default-options': 'off',
    },
  },
  yml: {
    overrides: {
      'yml/no-empty-document': 'off',
    },
  },
})
