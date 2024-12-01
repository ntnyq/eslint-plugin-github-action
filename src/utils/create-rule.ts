/**
 * @copyright {@link https://github.com/eslint-stylistic/eslint-stylistic}
 */

import { deepMerge, isObjectNotArray } from './merge'
import type {
  RuleContext,
  RuleListener,
  RuleModule,
  RuleWithMeta,
  RuleWithMetaAndName,
} from '../types/eslint'

const docsUrl = 'https://eslint-plugin-github-action.ntnyq.com/rules/'

export interface PluginDocs {
  recommended?: boolean
}

function createRule<TOptions extends readonly unknown[], TMessageIds extends string>({
  create,
  defaultOptions,
  meta,
}: Readonly<RuleWithMeta<TOptions, TMessageIds, PluginDocs>>): RuleModule<
  TMessageIds,
  TOptions,
  PluginDocs
> {
  return {
    create: ((context: Readonly<RuleContext<TMessageIds, TOptions>>): RuleListener => {
      const optionsCount = Math.max(context.options.length, defaultOptions.length)
      const optionsWithDefault = Array.from({ length: optionsCount }, (_, i) => {
        /* v8 ignore start */
        if (isObjectNotArray(context.options[i]) && isObjectNotArray(defaultOptions[i])) {
          return deepMerge(defaultOptions[i], context.options[i])
        }
        return context.options[i] ?? defaultOptions[i]
        /* v8 ignore stop */
      }) as unknown as TOptions
      return create(context, optionsWithDefault)
    }) as any,
    defaultOptions,
    meta: {
      ...meta,
      defaultOptions: defaultOptions as unknown as TOptions,
    },
  }
}

function RuleCreator(urlCreator: (name: string) => string) {
  return function createNamedRule<TOptions extends readonly unknown[], TMessageIds extends string>({
    name,
    meta,
    ...rule
  }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds, PluginDocs>>): RuleModule<
    TMessageIds,
    TOptions
  > {
    return createRule<TOptions, TMessageIds>({
      meta: {
        ...meta,
        docs: {
          ...meta.docs,
          url: urlCreator(name),
        },
      },
      ...rule,
    })
  }
}

export const createESLintRule: <TOptions extends readonly unknown[], TMessageIds extends string>({
  name,
  meta,
  ...rule
}: Readonly<RuleWithMetaAndName<TOptions, TMessageIds, PluginDocs>>) => RuleModule<
  TMessageIds,
  TOptions
> = RuleCreator(ruleName => `${docsUrl}${ruleName}.html`)
