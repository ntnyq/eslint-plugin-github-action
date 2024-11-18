import { defineESLintConfig } from '@ntnyq/eslint-config'
import pluginESLintPlugin from 'eslint-plugin-eslint-plugin'

const config = defineESLintConfig()

config.prepend(pluginESLintPlugin.configs['flat/all'])

export default config
