import { createESLintRule, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'no-top-level-env'
export type MessageIds = 'disallowTopLevelEnv'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'disallow using top level env.',
    },
    schema: [],
    messages: {
      disallowTopLevelEnv: 'Disallow using top level env.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const nodeEnv = node.pairs.find(v => isYAMLScalar(v.key) && v.key.value === 'env')

        if (nodeEnv) {
          context.report({
            node,
            loc: nodeEnv.loc,
            messageId: 'disallowTopLevelEnv',
          })
        }
      },
    }
  },
})
