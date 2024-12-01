import { configs } from './configs'
import { meta } from './meta'
import { rules } from './rules'
import type { ESLint } from 'eslint'

/**
 * eslint-plugin-github-action
 * Rules for consistent, readable and valid GitHub action files.
 *
 * @see {@link https://github.com/ntnyq/eslint-plugin-github-action}
 */
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
