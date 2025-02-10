import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'require-action-run-name'
export type MessageIds = 'noName' | 'invalidName'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'require a string action run-name.',
    },
    schema: [],
    messages: {
      noName: 'Require action run-name to be set.',
      invalidName: 'Action run-name must be a non-empty string.',
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
          messageId: 'noName',
        })
      },

      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const namePair = node.pairs.find(
          pair => isYAMLScalar(pair.key) && pair.key.value === 'run-name',
        )

        if (!namePair) {
          return context.report({
            node,
            messageId: 'noName',
          })
        }

        if (
          !isYAMLScalar(namePair.value)
          || !isNonEmptyString(namePair.value.value)
        ) {
          return context.report({
            node: namePair.value ?? namePair,
            loc: namePair.value?.loc ?? namePair.loc,
            messageId: 'invalidName',
          })
        }
      },
    }
  },
})
