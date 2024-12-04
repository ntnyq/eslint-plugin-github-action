import { createESLintRule } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'no-top-level-permissions'
export type MessageIds = 'disallowTopLevelPermissions'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'disallow using top level permissions.',
    },
    schema: [],
    messages: {
      disallowTopLevelPermissions: 'Disallow using top level permissions.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=permissions]': (
        node: YAMLAst.YAMLPair,
      ) => {
        context.report({
          node,
          loc: node.loc,
          messageId: 'disallowTopLevelPermissions',
        })
      },
    }
  },
})
