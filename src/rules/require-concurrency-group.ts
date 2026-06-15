import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'require-concurrency-group'
export type MessageIds = 'noConcurrencyGroup' | 'invalidConcurrencyGroup'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'require a workflow-level concurrency group.',
    },
    schema: [],
    messages: {
      noConcurrencyGroup: 'Require top-level concurrency group to be set.',
      invalidConcurrencyGroup:
        'Top-level concurrency group must be a non-empty string.',
    },
  },
  create(context) {
    return {
      YAMLDocument(node: YAMLAst.YAMLDocument) {
        if (!node.content || !isYAMLMapping(node.content)) {
          context.report({
            node,
            messageId: 'noConcurrencyGroup',
          })
          return
        }

        const concurrencyPair = node.content.pairs.find(
          pair => isYAMLScalar(pair.key) && pair.key.value === 'concurrency',
        )

        if (!concurrencyPair) {
          context.report({
            node: node.content,
            loc: node.content.loc,
            messageId: 'noConcurrencyGroup',
          })
          return
        }

        if (isYAMLScalar(concurrencyPair.value)) {
          if (isNonEmptyString(concurrencyPair.value.value)) {
            return
          }
        } else if (isYAMLMapping(concurrencyPair.value)) {
          const groupPair = concurrencyPair.value.pairs.find(
            pair => isYAMLScalar(pair.key) && pair.key.value === 'group',
          )

          if (
            groupPair &&
            isYAMLScalar(groupPair.value) &&
            isNonEmptyString(groupPair.value.value)
          ) {
            return
          }
        }

        context.report({
          node: concurrencyPair.value || concurrencyPair,
          loc: concurrencyPair.value?.loc || concurrencyPair.loc,
          messageId: 'invalidConcurrencyGroup',
        })
      },
    }
  },
})
