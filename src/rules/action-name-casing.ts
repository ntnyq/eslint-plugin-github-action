import { isNonEmptyString, isString } from '@ntnyq/utils'
import {
  CASING,
  createESLintRule,
  getExactConverter,
  isYAMLScalar,
  resolveOptions,
} from '../utils'
import type { YAMLAst } from '../types/yaml'
import type { CasingKind } from '../utils'

type AllowedCasing = CasingKind

export const RULE_NAME = 'action-name-casing'
export type MessageIds = 'actionNameNotMatch'
export type Options = [
  | AllowedCasing
  | ({ [key in AllowedCasing]?: boolean } & {
      ignores?: string[]
    }),
]

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
        description: 'Casing type for action name.',
        anyOf: [
          {
            type: 'string',
            description: 'Casing type for action name.',
            enum: allowedCaseOptions,
          },
          {
            type: 'object',
            description: 'Casing type for job id.',
            properties: {
              'kebab-case': {
                type: 'boolean',
              },
              camelCase: {
                type: 'boolean',
              },
              PascalCase: {
                type: 'boolean',
              },
              snake_case: {
                type: 'boolean',
              },
              'Title Case': {
                type: 'boolean',
              },
              'Train-Case': {
                type: 'boolean',
              },
              SCREAMING_SNAKE_CASE: {
                type: 'boolean',
              },
              ignores: {
                type: 'array',
                description: 'action name patterns to ignore.',
                items: {
                  type: 'string',
                },
                uniqueItems: true,
                additionalItems: false,
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      actionNameNotMatch: `Action name '{{name}}' is not in {{caseTypes}}.`,
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const rawOptions = resolveOptions(context.options, defaultOptions)

    const caseTypes: AllowedCasing[] = []
    const ignores = isString(rawOptions)
      ? []
      : (rawOptions.ignores || []).map(ignore => new RegExp(ignore))

    if (isString(rawOptions)) {
      // Enum options
      /* v8 ignore start guard by json-schema */
      caseTypes.push(
        allowedCaseOptions.includes(rawOptions) ? rawOptions : defaultOptions,
      )
      /* v8 ignore end guard by json-schema */
    } else {
      // Object options
      caseTypes.push(
        ...Object.keys(rawOptions)
          .filter((key): key is AllowedCasing =>
            allowedCaseOptions.includes(key as AllowedCasing),
          )
          .filter(key => rawOptions[key]),
      )

      // Object options is empty, use defaultOptions
      if (caseTypes.length === 0) {
        caseTypes.push(defaultOptions)
      }
    }

    const converters = caseTypes.map(caseType => getExactConverter(caseType))

    function isActionNameValid(name: string) {
      if (ignores.some(regex => regex.test(name))) {
        return true
      }

      // Some converter can NOT change action name
      return converters.some(converter => !converter(name).changed)
    }

    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=name]': (
        node: YAMLAst.YAMLPair,
      ) => {
        // name is a non-empty string
        if (isYAMLScalar(node.value) && isNonEmptyString(node.value.value)) {
          const name = node.value.value
          const range = node.value.range

          if (!isActionNameValid(name)) {
            context.report({
              node: node.value,
              messageId: 'actionNameNotMatch',
              loc: node.value.loc,
              data: {
                name,
                caseTypes: caseTypes.join(', '),
              },
              fix:
                caseTypes.length === 1
                  ? fixer => {
                      const result = getExactConverter(caseTypes[0])(name)
                      return fixer.replaceTextRange(range, result.value)
                    }
                  : undefined,
            })
          }
        }
      },
    }
  },
})
