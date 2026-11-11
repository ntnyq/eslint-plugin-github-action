import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, getYAMLScalarValue, isYAMLScalar } from '../utils'
import { getPairKeyValue } from '../utils/action'
import { visitWorkflow } from '../utils/workflow'
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
      description: 'require a string workflow run-name.',
    },
    schema: [],
    messages: {
      noName: 'Require action run-name to be set.',
      invalidName: 'Action run-name must be a non-empty string.',
    },
  },
  create(context) {
    return {
      YAMLDocument(document: YAMLAst.YAMLDocument) {
        if (!document.content) {
          context.report({ node: document, messageId: 'noName' })
          return
        }
        visitWorkflow(document, {
          workflow(node, resolve) {
            const namePair = node.pairs.find(
              pair => getPairKeyValue(pair) === 'run-name',
            )

            if (!namePair) {
              return context.report({
                node,
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
                loc: namePair.value?.loc ?? namePair.loc,
                messageId: 'invalidName',
              })
            }
          },
        })
      },
    }
  },
})
