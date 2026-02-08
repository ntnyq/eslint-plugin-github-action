// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  svgo: true,
  eslintPlugin: {
    overrides: {
      'eslint-plugin/require-meta-default-options': 'off',
    },
  },
  test: {
    overridesVitestRules: {
      // in favor of eslint-vitest-rule-tester
      'vitest/no-standalone-expect': 'off',
    },
  },
  typescript: {
    overrides: {
      '@typescript-eslint/consistent-generic-constructors': 'off',
    },
  },
  yml: {
    overrides: {
      'yml/no-empty-document': 'off',
    },
  },
})
