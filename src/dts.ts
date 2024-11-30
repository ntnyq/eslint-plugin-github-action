import type { Linter } from 'eslint'
import type { plugin } from '.'

type RuleDefinitions = (typeof plugin)['rules']

export type RuleOptions = {
  [K in keyof RuleDefinitions]: RuleDefinitions[K]['defaultOptions']
}

export type Rules = {
  [K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]>
}

export type RulesWithPluginName<Name extends string = 'github-action'> = {
  [K in keyof RuleOptions as `${Name}/${K}`]: Linter.RuleEntry<RuleOptions[K]>
}
