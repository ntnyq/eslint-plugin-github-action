import { createESLintRule } from '../utils'
import { getPairKeyValue } from '../utils/action'
import { visitWorkflow } from '../utils/workflow'

export const RULE_NAME = 'no-external-job'
export type MessageIds = 'disallowExternalJob'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'disallow using external jobs.',
    },
    schema: [],
    messages: {
      disallowExternalJob: 'Disallow using external job.',
    },
  },
  create(context) {
    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          job(mapping) {
            for (const node of mapping.pairs) {
              if (getPairKeyValue(node) === 'uses') {
                context.report({
                  node,
                  loc: node.loc,
                  messageId: 'disallowExternalJob',
                })
              }
            }
          },
        })
      },
    }
  },
})
