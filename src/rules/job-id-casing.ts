import { isNonEmptyString, isString } from '@ntnyq/utils'
import { CASING, createESLintRule, getExactConverter, isYAMLScalar } from '../utils'
import { getNodeJobsMapping } from '../utils/action'
import type { ASTNode } from '../types'
import type { YAMLAst } from '../types/yaml'
import type { CasingKind } from '../utils'

type AllowedCasing = Exclude<CasingKind, 'Title Case'>

export const RULE_NAME = 'job-id-casing'
export type MessageIds = 'jobIdNotMatch'
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
  CASING.trainCase,
  CASING.screamingSnakeCase,
]
const defaultOptions: Options[0] = CASING.kebabCase

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'enforce naming convention to job id.',
    },
    schema: [
      {
        description: 'Casing type for job id.',
        anyOf: [
          {
            type: 'string',
            description: 'Casing type for job id.',
            enum: allowedCaseOptions,
          },
          {
            type: 'object',
            description: 'Casing type for job id.',
            properties: {
              'kebab-case': {
                type: 'boolean',
                default: true,
              },
              camelCase: {
                type: 'boolean',
                default: false,
              },
              PascalCase: {
                type: 'boolean',
                default: false,
              },
              snake_case: {
                type: 'boolean',
                default: false,
              },
              'Train-Case': {
                type: 'boolean',
                default: false,
              },
              SCREAMING_SNAKE_CASE: {
                type: 'boolean',
                default: false,
              },
              ignores: {
                type: 'array',
                description: 'Job id patterns to ignore.',
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
      jobIdNotMatch: `Job id '{{id}}' is not in {{caseTypes}}.`,
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    // If options[0] is undefined, use defaultOptions
    const rawOptions = context.options?.[0] ?? defaultOptions

    const caseTypes: AllowedCasing[] = []
    const ignores = isString(rawOptions)
      ? []
      : (rawOptions.ignores || []).map(ignore => new RegExp(ignore))

    if (isString(rawOptions)) {
      // Enum options
      caseTypes.push(allowedCaseOptions.includes(rawOptions) ? rawOptions : defaultOptions)
    } else {
      // Object options
      caseTypes.push(
        ...Object.keys(rawOptions)
          .filter((key): key is AllowedCasing => allowedCaseOptions.includes(key as AllowedCasing))
          .filter(key => rawOptions[key]),
      )

      // Object options is empty, use defaultOptions
      if (caseTypes.length === 0) {
        caseTypes.push(defaultOptions)
      }
    }
    const converters = caseTypes.map(caseType => getExactConverter(caseType))

    function isJobIdValid(id: string) {
      if (ignores.some(regex => regex.test(id))) return true

      // Some converter can NOT change job id
      return converters.some(converter => !converter(id).changed)
    }

    return {
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const jobsMapping = getNodeJobsMapping(node)

        if (!jobsMapping) return

        for (const job of jobsMapping.pairs) {
          if (isYAMLScalar(job.key) && isNonEmptyString(job.key.value)) {
            const id = job.key.value

            if (!isJobIdValid(id)) {
              context.report({
                node: node as unknown as ASTNode,
                messageId: 'jobIdNotMatch',
                loc: job.key.loc,
                data: {
                  id,
                  caseTypes: caseTypes.join(', '),
                },
              })
            }
          }
        }
      },
    }
  },
})
