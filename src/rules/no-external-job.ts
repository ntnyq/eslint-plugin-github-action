import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import { getNodeJobsMapping } from '../utils/action'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'no-external-job'
export type MessageIds = 'disallowExternalJob'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'disallow using external job.',
    },
    schema: [],
    messages: {
      disallowExternalJob: 'Disallow using external job.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const jobsMapping = getNodeJobsMapping(node)

        if (!jobsMapping) return

        for (const job of jobsMapping.pairs) {
          if (isYAMLMapping(job.value)) {
            const usesPair = job.value.pairs.find(
              pair => isYAMLScalar(pair.key) && pair.key.value === 'uses',
            )

            if (usesPair) {
              context.report({
                node,
                loc: usesPair.loc,
                messageId: 'disallowExternalJob',
              })
            }
          }
        }
      },
    }
  },
})
