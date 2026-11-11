import { createESLintRule } from '../utils'
import { getPairKeyValue } from '../utils/action'
import { visitWorkflow } from '../utils/workflow'

export const RULE_NAME = 'no-top-level-env'
export type MessageIds = 'disallowTopLevelEnv'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'disallow using top-level env.',
    },
    schema: [],
    messages: {
      disallowTopLevelEnv: 'Disallow using top level env.',
    },
  },
  create(context) {
    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          workflow(mapping) {
            for (const node of mapping.pairs) {
              if (getPairKeyValue(node) === 'env') {
                context.report({
                  node,
                  loc: node.loc,
                  messageId: 'disallowTopLevelEnv',
                })
              }
            }
          },
        })
      },
    }
  },
})
