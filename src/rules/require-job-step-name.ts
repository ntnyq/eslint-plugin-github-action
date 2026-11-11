import { isNonEmptyString } from '@ntnyq/utils'
import { findYAMLPair, getYAMLScalarValue, isYAMLScalar } from '../utils/ast'
import { createESLintRule } from '../utils/createRule'
import { visitWorkflow } from '../utils/workflow'

export const RULE_NAME = 'require-job-step-name'
export type MessageIds = 'noName' | 'invalidName'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'require a string job step name.',
    },
    schema: [],
    messages: {
      noName: 'Require job step name to be set.',
      invalidName: 'Job step name must be a non-empty string.',
    },
  },
  create(context) {
    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          step(node, resolve) {
            const namePair = findYAMLPair(node, 'name')

            if (!namePair) {
              return context.report({
                node,
                loc: node.loc,
                messageId: 'noName',
              })
            }

            const value = resolve(namePair.value)
            if (
              !isYAMLScalar(value) ||
              !isNonEmptyString(getYAMLScalarValue(value))
            ) {
              return context.report({
                node: namePair.value ?? namePair,
                loc: namePair.value?.loc || namePair.loc,
                messageId: 'invalidName',
              })
            }
          },
        })
      },
    }
  },
})
