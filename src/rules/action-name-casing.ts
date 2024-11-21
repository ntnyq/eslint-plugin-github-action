import { isNonEmptyString } from '@ntnyq/utils'
import { allowedCaseOptions, createESLintRule, getExactConverter, isYAMLScalar } from '../utils'
import type { ASTNode } from '../types'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'action-name-casing'
export type MessageIds = 'actionNameNotMatch'
export type Options = [string]

const defaultCaseType = 'Title Case'

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'enforce naming convention to action name.',
    },
    fixable: 'code',
    schema: [
      {
        type: 'string',
        description: 'Casing type for action name.',
        enum: allowedCaseOptions,
      },
    ],
    messages: {
      actionNameNotMatch: `Action name '{{name}}' is not in {{caseType}}.`,
    },
  },
  defaultOptions: [defaultCaseType],
  create(context) {
    const optionCase = context.options?.[0]
    const caseType = allowedCaseOptions.includes(optionCase) ? optionCase : defaultCaseType

    return {
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const namePair = node.pairs.find(v => isYAMLScalar(v.key) && v.key.value === 'name')

        // action has no name
        if (!namePair) return

        // name is a non-empty string
        if (isYAMLScalar(namePair.value) && isNonEmptyString(namePair.value.value)) {
          const name = namePair.value.value
          const range = namePair.value.range

          const result = getExactConverter(caseType)(name)

          if (result.changed) {
            context.report({
              node: node as unknown as ASTNode,
              messageId: 'actionNameNotMatch',
              data: {
                name,
                caseType,
              },
              fix: fixer => fixer.replaceTextRange(range, result.value),
            })
          }
        }
      },
    }
  },
})
