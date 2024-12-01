import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import { getNodeJobsMapping, getNodeStepsSequence } from '../utils/action'
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
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const jobsMapping = getNodeJobsMapping(node)

        if (!jobsMapping) return

        for (const job of jobsMapping.pairs) {
          const stepSequence = getNodeStepsSequence(job)

          if (stepSequence) {
            for (const step of stepSequence.entries) {
              if (isYAMLMapping(step)) {
                const namePair = step.pairs.find(
                  pair => isYAMLScalar(pair.key) && pair.key.value === 'name',
                )

                if (namePair) {
                  // step name is not non-empty string
                  if (!isYAMLScalar(namePair.value) || !isNonEmptyString(namePair.value.value)) {
                    context.report({
                      // TODO: remove non-null assertion
                      node: namePair.value!,
                      loc: namePair.loc,
                      messageId: 'requireJobStepName',
                    })
                  }
                } else {
                  // step has no name
                  context.report({
                    node,
                    loc: step.loc,
                    messageId: 'requireJobStepName',
                  })
                }
              }
            }
          }
        }
      },
    }
  },
})
