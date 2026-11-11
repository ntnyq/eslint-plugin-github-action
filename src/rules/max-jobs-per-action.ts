import { getPairKeyValue, isYAMLMapping } from '../utils/ast'
import { createESLintRule } from '../utils/createRule'
import { visitWorkflow } from '../utils/workflow'

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
      description: 'enforce maximum jobs per workflow file.',
    },
    schema: [
      {
        type: 'integer',
        description: 'Max jobs per file.',
        minimum: 1,
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      toManyJobs: 'There are {{count}} jobs, maximum allowed is {{limit}}.',
    },
  },
  create(context, [optionLimit]) {
    /* v8 ignore next guard by json-schema */
    const limit = optionLimit >= 1 ? optionLimit : defaultOptions

    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          workflow(mapping, resolve) {
            for (const pair of mapping.pairs) {
              if (getPairKeyValue(pair) !== 'jobs') {
                continue
              }
              const node = resolve(pair.value)
              if (!isYAMLMapping(node)) {
                continue
              }
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
            }
          },
        })
      },
    }
  },
})
