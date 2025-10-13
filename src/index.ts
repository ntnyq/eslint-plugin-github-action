import { configs } from './configs'
import { meta } from './meta'
import { rules } from './rules'
import type { PluginGitHubAction } from './types/plugin'

/**
 * eslint-plugin-github-action
 * Rules for consistent, readable and valid GitHub action files.
 *
 * @see {@link https://github.com/ntnyq/eslint-plugin-github-action}
 */
export const plugin: PluginGitHubAction = {
  meta,
  rules,
  configs,
}

export default plugin

export * from './dts'
export * from './meta'
export * from './rules'
export * from './configs'
