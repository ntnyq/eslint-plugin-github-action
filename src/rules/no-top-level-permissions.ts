import { createESLintRule, resolveOptions } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'no-top-level-permissions'
export type MessageIds = 'disallowTopLevelPermissions'
export type Options = [
  {
    /**
     * Allow empty permissions block
     */
    allowEmpty?: boolean
  },
]

const defaultOptions = { allowEmpty: false } satisfies Options[0]

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'disallow using top-level permissions.',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          allowEmpty: {
            title: 'Allow empty permissions block.',
            description:
              'Some people consider putting an empty permissions block at the top level a good practice in case GitHub token has permissions (enabled intentionally or by accident), which are not relevant for the current workflow.',
            type: 'boolean',
          },
        },
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      disallowTopLevelPermissions: 'Disallow using top level permissions.',
    },
  },
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=permissions]':
        (node: YAMLAst.YAMLPair) => {
          const { allowEmpty = false } = resolveOptions(
            context.options,
            defaultOptions,
          )

          if (
            allowEmpty &&
            node.value?.type === 'YAMLMapping' &&
            node.value.pairs.length === 0
          ) {
            return
          }

          context.report({
            node,
            loc: node.loc,
            messageId: 'disallowTopLevelPermissions',
          })
        },
    }
  },
})
