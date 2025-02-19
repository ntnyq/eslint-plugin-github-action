import * as parserYAML from 'yaml-eslint-parser'
import { plugin } from '..'
import type { Linter } from 'eslint'
import type { RulesWithPluginName } from '../dts'

/**
 * Create config options
 * @deprecated
 */
export type CreateConfigOptions = Omit<Linter.Config, 'rules'> & {
  rules?: Partial<RulesWithPluginName>
}

/**
 * Create a ESLint config.
 *
 * @param options - ESLint Linter.Config with type support.
 * @returns ESLint config.
 * @deprecated
 */
/* v8 ignore start */
export function createConfig(options: CreateConfigOptions = {}) {
  const config: Linter.Config = {
    ...options,
    files: options.files || ['**/.github/workflows/*.y?(a)ml'],
    ignores: options.ignores || ['!**/.github/workflows/*.y?(a)ml'],
    plugins: {
      ...(options.plugins || {}),
      get 'github-action'() {
        return plugin
      },
    },
    languageOptions: {
      ...(options.languageOptions || {}),
      parser: parserYAML,
    },
  }
  return config
}
/* v8 ignore stop */

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
