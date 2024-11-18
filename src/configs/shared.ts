import * as yamlParser from 'yaml-eslint-parser'
import { plugin } from '..'
import type { Linter } from 'eslint'

export default {
  files: ['**/.github/workflows/*.y?(a)ml'],
  // Force lint GitHub action
  ignores: ['!**/.github/workflows/*.y?(a)ml'],
  languageOptions: {
    parser: yamlParser,
  },
  plugins: {
    get 'github-action'() {
      return plugin
    },
  },
} satisfies Linter.Config
