import { getPairKeyValue, isYAMLMapping } from '../utils/ast'
import { createESLintRule } from '../utils/createRule'
import { visitWorkflow } from '../utils/workflow'

export const RULE_NAME = 'no-top-level-permissions'
export type MessageIds = 'disallowTopLevelPermissions'
export type Options = [
  {
    /**
     * Allow empty permissions block
     */
    allowEmpty?: boolean
  },
]

const defaultOptions = { allowEmpty: false } satisfies Options[0]

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'disallow using top-level permissions.',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          allowEmpty: {
            title: 'Allow empty permissions block.',
            description:
              'Some people consider putting an empty permissions block at the top level a good practice in case GitHub token has permissions (enabled intentionally or by accident), which are not relevant for the current workflow.',
            type: 'boolean',
          },
        },
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      disallowTopLevelPermissions: 'Disallow using top level permissions.',
    },
  },
  create(context, [{ allowEmpty = false }]) {
    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          workflow(mapping, resolve) {
            for (const node of mapping.pairs) {
              if (getPairKeyValue(node) !== 'permissions') {
                continue
              }
              const value = resolve(node.value)
              if (
                allowEmpty &&
                isYAMLMapping(value) &&
                value.pairs.length === 0
              ) {
                continue
              }
              context.report({
                node,
                loc: node.loc,
                messageId: 'disallowTopLevelPermissions',
              })
            }
          },
        })
      },
    }
  },
})
