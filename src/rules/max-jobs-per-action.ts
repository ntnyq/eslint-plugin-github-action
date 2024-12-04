import { createESLintRule } from '../utils'
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
    /* v8 ignore next guard by json-schema */
    const limit = optionLimit >= 1 ? optionLimit : defaultOptions

    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping': (
        node: YAMLAst.YAMLMapping,
      ) => {
        const count = node.pairs.length

        if (count > limit) {
          context.report({
            node,
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
