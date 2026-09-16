// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  oxfmt: true,
  prettier: false,
  svgo: true,
  eslintPlugin: {
    overrides: {
      'eslint-plugin/require-meta-default-options': 'off',
      // These rules target yaml-eslint-parser, not an ESLint language plugin.
      'eslint-plugin/require-meta-languages': 'off',
    },
  },
  ntnyq: {
    overrides: {
      'ntnyq/prefer-object-method-syntax': [
        'error',
        {
          allowArrowFunctions: true,
        },
      ],
    },
  },
  test: {
    vitest: {
      overrides: {
        // in favor of eslint-vitest-rule-tester
        'vitest/no-standalone-expect': 'off',
      },
    },
  },
  yml: {
    overrides: {
      'yml/no-empty-document': 'off',
    },
  },
})
