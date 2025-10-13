import type { Linter } from 'eslint'
import type { rules } from '../rules'

export interface PluginGitHubAction {
  rules: typeof rules
  configs: {
    recommended: Linter.Config<Linter.RulesRecord>[]
  }
  meta: {
    name: string
    version: string
  }
}
