import * as yamlParser from 'yaml-eslint-parser'
import { plugin } from '..'
import type { Linter } from 'eslint'
import type { Rules } from '../dts'

export interface RecommendedOptions
  extends Pick<Linter.Config, 'name' | 'files' | 'ignores' | 'languageOptions'> {
  /**
   * Overrides rules.
   */
  overridesRules?: Rules
}

export function createRecommendedConfig(options: RecommendedOptions = {}) {
  const config: Linter.Config = {
    name: options.name || 'github-action/recommended',
    files: options.files || ['**/.github/workflows/*.y?(a)ml'],
    ignores: options.ignores || ['!**/.github/workflows/*.y?(a)ml'],
    languageOptions: {
      ...(options.languageOptions || {}),
      parser: yamlParser,
    },
    plugins: {
      get 'github-action'() {
        return plugin
      },
    },
    rules: {
      'github-action/require-action-name': 'error',

      ...(options.overridesRules || {}),
    },
  }
  return config
}

export const recommended = [
  // flat recommended config
  createRecommendedConfig(),
]

export const configs = {
  recommended,
}
