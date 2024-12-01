import * as yamlParser from 'yaml-eslint-parser'
import { plugin } from '..'
import type { Linter } from 'eslint'
import type { RulesWithPluginName } from '../dts'

export interface RecommendedOptions extends Linter.Config {
  /**
   * Overrides rules.
   */
  overridesRules?: RulesWithPluginName
}

/**
 * Create recommended config in flat style.
 *
 * @param options - Create recommended config {@link RecommendedOptions}.
 * @returns flat recommended config.
 */
export function createRecommendedConfig(options: RecommendedOptions = {}) {
  const config: Linter.Config = {
    ...options,

    // Overrides
    name: options.name || 'github-action/recommended',
    files: options.files || ['**/.github/workflows/*.y?(a)ml'],
    ignores: options.ignores || ['!**/.github/workflows/*.y?(a)ml'],
    languageOptions: {
      ...(options.languageOptions || {}),
      parser: yamlParser,
    },
    plugins: {
      ...(options.plugins || {}),

      /* v8 ignore start */
      get 'github-action'() {
        return plugin
      },
      /* v8 ignore stop */
    },
    rules: {
      'github-action/no-invalid-key': 'error',
      'github-action/prefer-file-extension': 'error',
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
