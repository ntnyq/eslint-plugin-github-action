import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

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
  defaultOptions: [],
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=steps] > YAMLSequence > YAMLMapping':
        (node: YAMLAst.YAMLMapping) => {
          const namePair = node.pairs.find(
            pair => isYAMLScalar(pair.key) && pair.key.value === 'name',
          )

          if (!namePair) {
            return context.report({
              node,
              loc: node.loc,
              messageId: 'noName',
            })
          }

          if (!isYAMLScalar(namePair.value) || !isNonEmptyString(namePair.value.value)) {
            return context.report({
              node: namePair.value ?? namePair,
              loc: namePair.value?.loc || namePair.loc,
              messageId: 'invalidName',
            })
          }
        },
    }
  },
})
