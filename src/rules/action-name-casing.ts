import { isNonEmptyString } from '@ntnyq/utils'
import {
  CASING,
  createESLintRule,
  getExactConverter,
  isYAMLScalar,
} from '../utils'
import type { YAMLAst } from '../types/yaml'
import type { CasingKind } from '../utils'

type AllowedCasing = CasingKind

export const RULE_NAME = 'action-name-casing'
export type MessageIds = 'actionNameNotMatch'
export type Options = [AllowedCasing]

const allowedCaseOptions: AllowedCasing[] = [
  CASING.camelCase,
  CASING.kebabCase,
  CASING.pascalCase,
  CASING.snakeCase,
  CASING.titleCase,
  CASING.trainCase,
  CASING.screamingSnakeCase,
]
const defaultOptions: Options[0] = CASING.titleCase

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
  defaultOptions: [defaultOptions],
  create(context) {
    /* v8 ignore next guard by json-schema */
    const optionCase = context.options?.[0] || defaultOptions

    /* v8 ignore next guard by json-schema */
    const caseType = allowedCaseOptions.includes(optionCase)
      ? optionCase
      : defaultOptions

    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=name]': (
        node: YAMLAst.YAMLPair,
      ) => {
        // name is a non-empty string
        if (isYAMLScalar(node.value) && isNonEmptyString(node.value.value)) {
          const name = node.value.value
          const range = node.value.range

          const result = getExactConverter(caseType)(name)

          if (result.changed) {
            context.report({
              node: node.value,
              messageId: 'actionNameNotMatch',
              loc: node.value.loc,
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
