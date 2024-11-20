import { defineESLintConfig } from '@ntnyq/eslint-config'
import pluginESLintPlugin from 'eslint-plugin-eslint-plugin'

const config = defineESLintConfig({
  ignores: ['**/tests/fixtures'],
})

config.prepend(pluginESLintPlugin.configs['flat/all'], {
  rules: {
    // injected by `createRule`
    'eslint-plugin/require-meta-docs-url': 'off',
  },
})

export default config
