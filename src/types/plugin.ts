import type { Linter } from 'eslint'
import type { rules } from '../rules'

/**
 * GitHub Actions ESLint plugin with its rules, flat configurations, and
 * identity.
 */
export interface PluginGitHubAction {
  /**
   * Rule modules indexed by their names without the plugin namespace.
   */
  rules: typeof rules
  /**
   * Shareable flat configurations provided by the plugin.
   */
  configs: {
    /**
     * Recommended rules and YAML parser configuration for workflow files.
     */
    recommended: Linter.Config<Linter.RulesRecord>[]
  }
  /**
   * Package identity used by ESLint to identify the plugin.
   */
  meta: {
    /**
     * Published npm package name of the plugin.
     */
    name: string
    /**
     * Published package version of the plugin.
     */
    version: string
  }
}
