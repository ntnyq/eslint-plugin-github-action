import shared from './shared'
import type { Linter } from 'eslint'

export default [
  {
    ...shared,
    name: 'github-action/all',
    rules: {
      'github-action/require-action-name': 'error',
    },
  },
] satisfies Linter.Config[]
