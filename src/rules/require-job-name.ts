import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'require-job-name'
export type MessageIds = 'requireJobName'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'require job name to be set.',
    },
    schema: [],
    messages: {
      requireJobName: 'Require job name to be set.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair': (
        node: YAMLAst.YAMLPair,
      ) => {
        if (isYAMLMapping(node.value)) {
          const namePair = node.value.pairs.find(
            pair => isYAMLScalar(pair.key) && pair.key.value === 'name',
          )

          if (namePair) {
            // job name is not non-empty string
            if (!isYAMLScalar(namePair.value) || !isNonEmptyString(namePair.value.value)) {
              context.report({
                node: namePair.value || namePair,
                loc: namePair.value?.loc || namePair.loc,
                messageId: 'requireJobName',
              })
            }
          } else {
            // job has no name
            context.report({
              node: node.value,
              loc: node.loc,
              messageId: 'requireJobName',
            })
          }
        } else {
          // job value is not a mapping
          context.report({
            node: node.value || node,
            loc: node.value?.loc || node.loc,
            messageId: 'requireJobName',
          })
        }
      },
    }
  },
})
