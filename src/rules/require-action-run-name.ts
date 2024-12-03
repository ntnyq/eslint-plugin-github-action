import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'require-action-run-name'
export type MessageIds = 'requireActionRunName'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'require action run-name to be set.',
    },
    schema: [],
    messages: {
      requireActionRunName: 'Require action run-name to be set.',
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
          messageId: 'requireActionRunName',
        })
      },

      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const hasRunName = node.pairs.some(v => {
          if (isYAMLScalar(v.key) && isYAMLScalar(v.value)) {
            return v.key.value === 'run-name' && isNonEmptyString(v.value.value)
          } else {
            return false
          }
        })

        if (!hasRunName) {
          context.report({
            node,
            messageId: 'requireActionRunName',
          })
        }
      },
    }
  },
})
