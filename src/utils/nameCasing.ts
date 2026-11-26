/**
 * @file Shared options, checks, and fixes for display name casing rules
 */

import { isNonEmptyString, isString } from '@ntnyq/utils'
import { parseYAML } from 'yaml-eslint-parser'
import { getYAMLScalarValue, hasExternalYAMLAlias, isYAMLScalar } from './ast'
import { CASING, getExactConverter } from './casing'
import type { JSONSchema4 } from 'json-schema'
import type { RuleContext } from '../types/eslint'
import type { YAMLAst } from '../types/yaml'
import type { CasingKind } from './casing'

/**
 * Options shared by the workflow, job, and step name casing rules.
 */
export type NameCasingOptions = [
  | CasingKind
  | ({ [key in CasingKind]?: boolean } & {
      allowLowercaseMinorWords?: boolean
      ignores?: string[]
    }),
]

const allowedCaseOptions: CasingKind[] = [
  CASING.camelCase,
  CASING.kebabCase,
  CASING.pascalCase,
  CASING.snakeCase,
  CASING.titleCase,
  CASING.trainCase,
  CASING.screamingSnakeCase,
]

export const defaultNameCasingOption: CasingKind = CASING.titleCase

/**
 * Builds the option schema for a name casing rule.
 *
 * @param subject - Name being checked, such as `job name`.
 * @returns JSON schema for the rule options.
 */
export function createNameCasingSchema(subject: string): JSONSchema4[] {
  return [
    {
      description: `Casing type for ${subject}.`,
      anyOf: [
        {
          type: 'string',
          description: `Casing type for ${subject}.`,
          enum: allowedCaseOptions,
        },
        {
          type: 'object',
          description: `Casing types for ${subject}.`,
          properties: {
            ...Object.fromEntries(
              allowedCaseOptions.map(caseType => [
                caseType,
                { type: 'boolean' },
              ]),
            ),
            allowLowercaseMinorWords: {
              type: 'boolean',
              description:
                'Allow minor words, except the first word, to stay lowercase in Title Case.',
            },
            ignores: {
              type: 'array',
              description: `${subject} patterns to ignore.`,
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
  ]
}

/**
 * Creates a name checker from resolved rule options.
 *
 * @param rawOptions - Resolved rule option.
 * @returns Allowed casings, a validity check, and a converter for fixes.
 */
export function createNameCasingChecker(rawOptions: NameCasingOptions[0]) {
  const caseTypes: CasingKind[] = []
  const ignores = isString(rawOptions)
    ? []
    : (rawOptions.ignores || []).map(ignore => new RegExp(ignore))
  const allowLowercaseMinorWords =
    !isString(rawOptions) && rawOptions.allowLowercaseMinorWords === true

  if (isString(rawOptions)) {
    // Enum options
    /* v8 ignore start guard by json-schema */
    caseTypes.push(
      allowedCaseOptions.includes(rawOptions)
        ? rawOptions
        : defaultNameCasingOption,
    )
    /* v8 ignore end guard by json-schema */
  } else {
    // Object options
    caseTypes.push(
      ...Object.keys(rawOptions)
        .filter((key): key is CasingKind =>
          allowedCaseOptions.includes(key as CasingKind),
        )
        .filter(key => rawOptions[key]),
    )

    // Object options is empty, use defaultOptions
    if (caseTypes.length === 0) {
      caseTypes.push(defaultNameCasingOption)
    }
  }

  const converters = caseTypes.map(caseType =>
    getExactConverter(caseType, { allowLowercaseMinorWords }),
  )

  return {
    caseTypes,
    converters,
    isValid(name: string) {
      if (ignores.some(regex => regex.test(name))) {
        return true
      }

      // Some converter can NOT change the name
      return converters.some(converter => !converter(name).changed)
    },
  }
}

/**
 * Reports a display name that does not match the configured casing.
 *
 * Fixes add quotes when needed to preserve the YAML string type. An aliased
 * name is replaced at its use; anchored names referenced elsewhere and names
 * whose converted value would be empty are reported without a fix.
 *
 * @param context - Rule context.
 * @param checker - Checker created from the rule options.
 * @param pair - Mapping pair whose key is `name`.
 * @param resolve - Resolver for YAML metadata and aliases.
 * @param messageId - Message to report.
 */
export function checkNameCasing<TMessageIds extends string>(
  context: Readonly<RuleContext<TMessageIds, NameCasingOptions>>,
  checker: ReturnType<typeof createNameCasingChecker>,
  pair: YAMLAst.YAMLPair,
  resolve: (
    node: YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null,
  ) => YAMLAst.YAMLContent | null,
  messageId: TMessageIds,
) {
  const value = resolve(pair.value)
  if (!isYAMLScalar(value)) {
    return
  }
  const name = getYAMLScalarValue(value)
  // name is a non-empty string
  if (!isNonEmptyString(name) || checker.isValid(name)) {
    return
  }
  const { caseTypes, converters } = checker
  const sourceValue = pair.value ?? value
  const isAlias = sourceValue.type === 'YAMLAlias'
  const range = isAlias ? sourceValue.range : value.range
  const style = isAlias ? 'double-quoted' : value.style

  context.report({
    node: sourceValue,
    messageId,
    loc: sourceValue.loc,
    data: {
      name,
      caseTypes: caseTypes.join(', '),
    },
    fix:
      converters.length === 1 && !hasExternalYAMLAlias(sourceValue)
        ? fixer => {
            let replacement = converters[0](name).value
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
                (!isYAMLScalar(parsed) || parsed.value !== replacement)) ||
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
