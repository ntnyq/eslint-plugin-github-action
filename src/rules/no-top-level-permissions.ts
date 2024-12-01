import { createESLintRule, isYAMLScalar } from '../utils'
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
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const nodePermissions = node.pairs.find(
          v => isYAMLScalar(v.key) && v.key.value === 'permissions',
        )

        if (nodePermissions) {
          context.report({
            node,
            loc: nodePermissions.loc,
            messageId: 'disallowTopLevelPermissions',
          })
        }
      },
    }
  },
})
