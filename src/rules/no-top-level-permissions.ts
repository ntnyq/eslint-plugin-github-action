import { createESLintRule, isYAMLScalar } from '../utils'
import type { ASTNode } from '../types'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'no-top-level-permissions'
export type MessageIds = 'disallowTopLevelPermissions'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: true,
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
        const hasPermissions = node.pairs.some(
          v => isYAMLScalar(v.key) && v.key.value === 'permissions',
        )

        if (hasPermissions) {
          context.report({
            node: node as unknown as ASTNode,
            messageId: 'disallowTopLevelPermissions',
          })
        }
      },
    }
  },
})
