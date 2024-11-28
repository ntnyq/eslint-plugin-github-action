import { defineESLintConfig } from '@ntnyq/eslint-config'
import pluginESLintPlugin from 'eslint-plugin-eslint-plugin'

export default defineESLintConfig(
  {
    ignores: ['**/tests/fixtures'],
  },
  {
    ...pluginESLintPlugin.configs['flat/all'],
    rules: {
      ...pluginESLintPlugin.configs['flat/all'].rules,
      // injected by `createRule`
      'eslint-plugin/require-meta-docs-url': 'off',
    },
  },
)
