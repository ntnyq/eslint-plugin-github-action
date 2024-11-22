import { configs } from './configs'
import { meta } from './meta'
import { rules } from './rules'
import type { ESLint } from 'eslint'

export const plugin = {
  meta,
  rules,
  configs,
} satisfies ESLint.Plugin

export default plugin

export * from './dts'
export * from './meta'
export * from './rules'
export * from './configs'
