import { validTopLevelKeys } from '../constants/key'
import { createESLintRule } from '../utils'
import { getPairKeyValue } from '../utils/action'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'no-invalid-key'
export type MessageIds = 'invalidTopLevel'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: true,
      description: 'disallow using invalid key.',
    },
    schema: [],
    messages: {
      invalidTopLevel: 'invalid top-level key `{{key}}`.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        for (const pair of node.pairs) {
          const pairKeyValue = getPairKeyValue(pair)

          if (
            // key.value is not a string
            !pairKeyValue ||
            // key.value is valid
            validTopLevelKeys.includes(pairKeyValue)
          ) {
            continue
          }

          context.report({
            node,
            loc: pair.key?.loc,
            messageId: 'invalidTopLevel',
            data: {
              key: pairKeyValue,
            },
          })
        }
      },
    }
  },
})
