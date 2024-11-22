import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import type { ASTNode } from '../types'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'max-jobs-per-action'
export type MessageIds = 'toManyJobs'
export type Options = [number]

const defaultOptions: Options[0] = 3

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'enforce maximum jobs per action file.',
    },
    schema: [
      {
        type: 'integer',
        description: 'Max jobs per file.',
        minimum: 1,
      },
    ],
    messages: {
      toManyJobs: 'There are {{count}} jobs, maximum allowed is {{limit}}.',
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const optionLimit = context.options?.[0]
    const limit = optionLimit <= 0 ? defaultOptions : optionLimit
    return {
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const jobsPair = node.pairs.find(v => isYAMLScalar(v.key) && v.key.value === 'jobs')

        // action has no jobs
        if (!jobsPair) return

        // jobs is not a mapping
        if (!isYAMLMapping(jobsPair.value)) return

        const count = jobsPair.value.pairs.length

        if (count > limit) {
          context.report({
            node: node as unknown as ASTNode,
            messageId: 'toManyJobs',
            data: {
              count,
              limit,
            },
          })
        }
      },
    }
  },
})
