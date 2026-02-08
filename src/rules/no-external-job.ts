import { createESLintRule } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'no-external-job'
export type MessageIds = 'disallowExternalJob'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'disallow using external jobs.',
    },
    schema: [],
    messages: {
      disallowExternalJob: 'Disallow using external job.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=uses]':
        (node: YAMLAst.YAMLPair) => {
          context.report({
            node,
            loc: node.loc,
            messageId: 'disallowExternalJob',
          })
        },
    }
  },
})
