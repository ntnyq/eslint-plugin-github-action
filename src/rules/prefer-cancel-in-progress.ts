import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'prefer-cancel-in-progress'
export type MessageIds = 'preferCancelInProgress'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'enforce setting concurrency cancel-in-progress to true.',
    },
    schema: [],
    messages: {
      preferCancelInProgress:
        'Prefer setting concurrency cancel-in-progress to true.',
    },
  },
  create(context) {
    function checkConcurrency(node: YAMLAst.YAMLPair) {
      if (!isYAMLMapping(node.value)) {
        context.report({
          node: node.value || node,
          loc: node.value?.loc || node.loc,
          messageId: 'preferCancelInProgress',
        })
        return
      }

      const cancelPair = node.value.pairs.find(
        pair =>
          isYAMLScalar(pair.key) && pair.key.value === 'cancel-in-progress',
      )

      if (
        !cancelPair ||
        !isYAMLScalar(cancelPair.value) ||
        cancelPair.value.value !== true
      ) {
        context.report({
          node: cancelPair?.value || cancelPair || node.value,
          loc: cancelPair?.value?.loc || cancelPair?.loc || node.value.loc,
          messageId: 'preferCancelInProgress',
        })
      }
    }

    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=concurrency]':
        (node: YAMLAst.YAMLPair) => {
          checkConcurrency(node)
        },
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=concurrency]':
        (node: YAMLAst.YAMLPair) => {
          checkConcurrency(node)
        },
    }
  },
})
