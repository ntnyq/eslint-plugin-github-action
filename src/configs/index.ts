import * as parserYAML from 'yaml-eslint-parser'
import { plugin } from '..'
import type { Linter } from 'eslint'

/**
 * recommended config
 */
export const recommended: Linter.Config[] = [
  {
    name: 'github-action/recommended',
    files: ['**/.github/workflows/*.y?(a)ml'],
    ignores: ['!**/.github/workflows/*.y?(a)ml'],
    plugins: {
      /* v8 ignore start */
      get 'github-action'() {
        return plugin
      },
      /* v8 ignore stop */
    },
    languageOptions: {
      parser: parserYAML,
    },
    rules: {
      'github-action/no-invalid-key': 'error',
      'github-action/prefer-file-extension': 'error',
      'github-action/require-action-name': 'error',
    },
  },
]

export const configs = {
  recommended,
}
