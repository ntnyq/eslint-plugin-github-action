import { createESLintRule } from '../utils'
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
      description: 'disallow using top-level env.',
    },
    schema: [],
    messages: {
      disallowTopLevelEnv: 'Disallow using top level env.',
    },
  },
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=env]': (
        node: YAMLAst.YAMLPair,
      ) => {
        context.report({
          node,
          loc: node.loc,
          messageId: 'disallowTopLevelEnv',
        })
      },
    }
  },
})
