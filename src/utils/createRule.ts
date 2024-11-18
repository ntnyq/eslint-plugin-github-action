import type {
  RuleListener,
  RuleWithMeta,
  RuleWithMetaAndName,
} from '@typescript-eslint/utils/eslint-utils'
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint'
import type { Rule } from 'eslint'

const docsUrl = 'https://eslint-plugin-github-action.ntnyq.com/rules/'

export interface RuleModule<T extends readonly unknown[]> extends Rule.RuleModule {
  defaultOptions: T
}

export interface PluginDocs {
  recommended?: boolean
}

function createRule<TOptions extends readonly unknown[], TMessageIds extends string>({
  create,
  defaultOptions,
  meta,
}: Readonly<RuleWithMeta<TOptions, TMessageIds, PluginDocs>>): RuleModule<TOptions> {
  return {
    create: ((context: Readonly<RuleContext<TMessageIds, TOptions>>): RuleListener => {
      const optionsWithDefault = context.options.map((option, index) => {
        return {
          ...(defaultOptions[index] || {}),
          ...(option || {}),
        }
      }) as unknown as TOptions
      return create(context, optionsWithDefault)
    }) as any,
    defaultOptions,
    meta: meta as any,
  }
}

function RuleCreator(urlCreator: (name: string) => string) {
  return function createNamedRule<TOptions extends readonly unknown[], TMessageIds extends string>({
    name,
    meta,
    ...rule
  }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds, PluginDocs>>): RuleModule<TOptions> {
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
}: Readonly<RuleWithMetaAndName<TOptions, TMessageIds, PluginDocs>>) => RuleModule<TOptions> =
  RuleCreator(ruleName => `${docsUrl}${ruleName}.html`)
