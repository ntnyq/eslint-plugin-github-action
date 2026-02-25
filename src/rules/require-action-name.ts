import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'require-action-name'
export type MessageIds = 'noName' | 'invalidName'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: true,
      description: 'require a string workflow name.',
    },
    schema: [],
    messages: {
      noName: 'Require action name to be set.',
      invalidName: 'Action name must be a non-empty string.',
    },
  },
  create(context) {
    return {
      YAMLDocument(node: YAMLAst.YAMLDocument) {
        if (node.content) {
          return
        }

        // Empty file
        context.report({
          node,
          messageId: 'noName',
        })
      },

      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const namePair = node.pairs.find(
          pair => isYAMLScalar(pair.key) && pair.key.value === 'name',
        )

        if (!namePair) {
          return context.report({
            node,
            messageId: 'noName',
          })
        }

        if (
          !isYAMLScalar(namePair.value) ||
          !isNonEmptyString(namePair.value.value)
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
