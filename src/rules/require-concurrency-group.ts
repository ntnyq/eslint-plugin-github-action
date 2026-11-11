import { isNonEmptyString } from '@ntnyq/utils'
import {
  createESLintRule,
  getYAMLScalarValue,
  isYAMLMapping,
  isYAMLScalar,
  resolveYAMLNode,
} from '../utils'
import { getPairKeyValue } from '../utils/action'
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
        const workflow = resolveYAMLNode(node.content)
        if (!isYAMLMapping(workflow)) {
          context.report({
            node,
            messageId: 'noConcurrencyGroup',
          })
          return
        }

        const concurrencyPair = workflow.pairs.find(
          pair => getPairKeyValue(pair) === 'concurrency',
        )

        if (!concurrencyPair) {
          context.report({
            node: workflow,
            loc: workflow.loc,
            messageId: 'noConcurrencyGroup',
          })
          return
        }

        const concurrency = resolveYAMLNode(concurrencyPair.value)
        if (isYAMLScalar(concurrency)) {
          if (isNonEmptyString(getYAMLScalarValue(concurrency))) {
            return
          }
        } else if (isYAMLMapping(concurrency)) {
          const groupPair = concurrency.pairs.find(
            pair => getPairKeyValue(pair) === 'group',
          )

          const group = resolveYAMLNode(groupPair?.value ?? null)
          if (
            isYAMLScalar(group) &&
            isNonEmptyString(getYAMLScalarValue(group))
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
