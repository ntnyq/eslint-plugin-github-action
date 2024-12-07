import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'require-job-name'
export type MessageIds = 'noName' | 'invalidName'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'require a string job name.',
    },
    schema: [],
    messages: {
      noName: 'Require job name to be set.',
      invalidName: 'Job name must be a non-empty string.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair': (
        node: YAMLAst.YAMLPair,
      ) => {
        if (!isYAMLMapping(node.value)) {
          return context.report({
            node: node.value ?? node,
            loc: node.value?.loc ?? node.loc,
            messageId: 'noName',
          })
        }

        const namePair = node.value.pairs.find(
          pair => isYAMLScalar(pair.key) && pair.key.value === 'name',
        )

        if (!namePair) {
          return context.report({
            node,
            loc: node.loc,
            messageId: 'noName',
          })
        }

        // job name is not non-empty string
        if (!isYAMLScalar(namePair.value) || !isNonEmptyString(namePair.value.value)) {
          return context.report({
            node: namePair.value || namePair,
            loc: namePair.value?.loc || namePair.loc,
            messageId: 'invalidName',
          })
        }
      },
    }
  },
})
