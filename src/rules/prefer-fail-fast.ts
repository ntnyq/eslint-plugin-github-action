import { createESLintRule, getYAMLScalarValue, isYAMLScalar } from '../utils'
import { getPairKeyValue } from '../utils/action'
import { visitWorkflow } from '../utils/workflow'

export const RULE_NAME = 'prefer-fail-fast'
export type MessageIds = 'unexpected'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'disallow setting fail-fast to false.',
    },
    schema: [],
    messages: {
      unexpected: 'Disallow setting fail-fast to false.',
    },
  },
  create(context) {
    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          strategy(node, resolve) {
            for (const pair of node.pairs) {
              if (getPairKeyValue(pair) !== 'fail-fast') {
                continue
              }
              const value = resolve(pair.value)
              if (isYAMLScalar(value) && getYAMLScalarValue(value) === false) {
                context.report({
                  node: pair,
                  loc: pair.loc,
                  messageId: 'unexpected',
                })
              }
            }
          },
        })
      },
    }
  },
})
