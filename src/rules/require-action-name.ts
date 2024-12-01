import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'require-action-name'
export type MessageIds = 'requireActionName'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: true,
      description: 'require action name to be set.',
    },
    schema: [],
    messages: {
      requireActionName: 'Require action name to be set.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      YAMLDocument(node: YAMLAst.YAMLDocument) {
        if (node.content) return

        // Empty file
        context.report({
          node,
          messageId: 'requireActionName',
        })
      },

      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const hasName = node.pairs.some(v => {
          if (isYAMLScalar(v.key) && isYAMLScalar(v.value)) {
            return v.key.value === 'name' && isNonEmptyString(v.value.value)
          } else {
            return false
          }
        })

        if (!hasName) {
          context.report({
            node,
            messageId: 'requireActionName',
          })
        }
      },
    }
  },
})
