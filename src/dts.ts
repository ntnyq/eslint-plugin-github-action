import type { Linter } from 'eslint'
import type { rules } from './rules'

type RuleDefinitions = typeof rules

export type RuleOptions = {
  [K in keyof RuleDefinitions]: RuleDefinitions[K]['defaultOptions']
}

export type Rules = {
  [K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]>
}
