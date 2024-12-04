import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'require-job-step-name'
export type MessageIds = 'requireJobStepName'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'require job step name to be set.',
    },
    schema: [],
    messages: {
      requireJobStepName: 'Require job step name to be set.',
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

          if (namePair) {
            // step name is not non-empty string
            if (!isYAMLScalar(namePair.value) || !isNonEmptyString(namePair.value.value)) {
              context.report({
                node: namePair.value ?? namePair,
                loc: namePair.value?.loc || namePair.loc,
                messageId: 'requireJobStepName',
              })
            }
          } else {
            // step has no name
            context.report({
              node,
              loc: node.loc,
              messageId: 'requireJobStepName',
            })
          }
        },
    }
  },
})
