import { isNonEmptyString, isString } from '@ntnyq/utils'
import { parseYAML } from 'yaml-eslint-parser'
import {
  getPairKeyValue,
  getYAMLScalarValue,
  hasExternalYAMLAlias,
  isYAMLScalar,
} from '../utils/ast'
import { CASING, getExactConverter } from '../utils/casing'
import { createESLintRule } from '../utils/createRule'
import { visitWorkflow } from '../utils/workflow'
import type { CasingKind } from '../utils/casing'

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
      description: 'enforce naming convention for workflow name.',
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
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      actionNameNotMatch: `Action name '{{name}}' is not in {{caseTypes}}.`,
    },
  },
  create(context, [rawOptions]) {
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
      YAMLDocument(document) {
        visitWorkflow(document, {
          workflow(mapping, resolve) {
            for (const node of mapping.pairs) {
              if (getPairKeyValue(node) !== 'name') {
                continue
              }
              const value = resolve(node.value)
              const scalarValue = isYAMLScalar(value)
                ? getYAMLScalarValue(value)
                : null
              // name is a non-empty string
              if (isYAMLScalar(value) && isNonEmptyString(scalarValue)) {
                const name = scalarValue
                const sourceValue = node.value ?? value
                const isAlias = sourceValue.type === 'YAMLAlias'
                const range = isAlias ? sourceValue.range : value.range
                const style = isAlias ? 'double-quoted' : value.style

                if (!isActionNameValid(name)) {
                  context.report({
                    node: sourceValue,
                    messageId: 'actionNameNotMatch',
                    loc: sourceValue.loc,
                    data: {
                      name,
                      caseTypes: caseTypes.join(', '),
                    },
                    fix:
                      caseTypes.length === 1 &&
                      !hasExternalYAMLAlias(sourceValue)
                        ? fixer => {
                            const result = getExactConverter(caseTypes[0])(name)
                            let replacement = result.value
                            if (!isNonEmptyString(replacement)) {
                              return null
                            }

                            // Casing can turn a plain string into a YAML boolean,
                            // number, or null. Preserve its string type in both versions.
                            const parsed = parseYAML(replacement, {
                              defaultYAMLVersion: '1.1',
                            }).body[0].content
                            if (
                              (style === 'plain' &&
                                (!isYAMLScalar(parsed) ||
                                  parsed.value !== replacement)) ||
                              (style !== 'plain' && style !== 'single-quoted')
                            ) {
                              replacement = JSON.stringify(replacement)
                            } else if (style === 'single-quoted') {
                              replacement = `'${replacement.replaceAll("'", "''")}'`
                            }

                            return fixer.replaceTextRange(range, replacement)
                          }
                        : undefined,
                  })
                }
              }
            }
          },
        })
      },
    }
  },
})
