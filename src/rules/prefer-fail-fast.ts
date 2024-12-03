import { createESLintRule, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'prefer-fail-fast'
export type MessageIds = 'unexpected'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'disallow setting fail-fast to false.',
    },
    schema: [],
    messages: {
      unexpected: 'Disallow setting fail-fast to false.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=strategy] > YAMLMapping > YAMLPair[key.value=fail-fast]':
        (node: YAMLAst.YAMLPair) => {
          if (!isYAMLScalar(node.value)) {
            return
          }

          // check fail-fast value
          if (node.value.value === false) {
            context.report({
              node,
              loc: node.loc,
              messageId: 'unexpected',
            })
          }
        },
    }
  },
})
