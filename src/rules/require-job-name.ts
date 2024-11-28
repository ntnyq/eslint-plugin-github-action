import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import { getNodeJobsMapping } from '../utils/action'
import type { ASTNode } from '../types'
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
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const jobsMapping = getNodeJobsMapping(node)

        if (!jobsMapping) return

        for (const job of jobsMapping.pairs) {
          if (isYAMLMapping(job.value)) {
            const namePair = job.value.pairs.find(
              pair => isYAMLScalar(pair.key) && pair.key.value === 'name',
            )

            if (namePair) {
              // job name is not non-empty string
              if (!isYAMLScalar(namePair.value) || !isNonEmptyString(namePair.value.value)) {
                context.report({
                  node: namePair.value as unknown as ASTNode,
                  loc: namePair.loc,
                  messageId: 'requireJobName',
                })
              }
            } else {
              // job has no name
              context.report({
                node: node as unknown as ASTNode,
                loc: job.loc,
                messageId: 'requireJobName',
              })
            }
          } else {
            // job value is not a mapping
            context.report({
              node: node as unknown as ASTNode,
              loc: job.loc,
              messageId: 'requireJobName',
            })
          }
        }
      },
    }
  },
})
