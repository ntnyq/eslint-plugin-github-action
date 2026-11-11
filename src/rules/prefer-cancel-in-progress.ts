import {
  findYAMLPair,
  getPairKeyValue,
  getYAMLScalarValue,
  isYAMLMapping,
  isYAMLScalar,
  resolveYAMLNode,
} from '../utils/ast'
import { createESLintRule } from '../utils/createRule'
import { visitWorkflow } from '../utils/workflow'
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
      const concurrency = resolveYAMLNode(node.value)
      if (!isYAMLMapping(concurrency)) {
        context.report({
          node: node.value || node,
          loc: node.value?.loc || node.loc,
          messageId: 'preferCancelInProgress',
        })
        return
      }

      const cancelPair = findYAMLPair(concurrency, 'cancel-in-progress')

      const cancel = resolveYAMLNode(cancelPair?.value ?? null)
      if (!isYAMLScalar(cancel) || getYAMLScalarValue(cancel) !== true) {
        context.report({
          node: cancelPair?.value || cancelPair || concurrency,
          loc: cancelPair?.value?.loc || cancelPair?.loc || concurrency.loc,
          messageId: 'preferCancelInProgress',
        })
      }
    }

    function checkMapping(mapping: YAMLAst.YAMLMapping) {
      for (const pair of mapping.pairs) {
        if (getPairKeyValue(pair) === 'concurrency') {
          checkConcurrency(pair)
        }
      }
    }

    return {
      YAMLDocument(document) {
        visitWorkflow(document, { workflow: checkMapping, job: checkMapping })
      },
    }
  },
})
