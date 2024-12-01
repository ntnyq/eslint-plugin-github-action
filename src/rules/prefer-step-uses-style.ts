import { isNonEmptyString, isString } from '@ntnyq/utils'
import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import { getNodeJobsMapping, getNodeStepsSequence } from '../utils/action'
import type { YAMLAst } from '../types/yaml'

const UsesStyle = {
  commit: 'commit',
  release: 'release',
  branch: 'branch',
} as const

type AllowedUsesStyle = keyof typeof UsesStyle

export const RULE_NAME = 'prefer-step-uses-style'
export type MessageIds = 'invalidStyle' | 'disallowRepository' | 'disallowDocker' | 'disallowStyle'
export type Options = [
  | AllowedUsesStyle
  | ({ [key in AllowedUsesStyle]?: boolean } & {
      /**
       * Ignore patterns
       */
      ignores?: string[]

      /**
       * Allow using an action inside the repository.
       *
       * @default false
       */
      allowRepository?: boolean

      /**
       * Allow using an action from:
       * - Docker Hub action
       * - GitHub Packages Container registry.
       * - Docker public registry action
       *
       * @default false
       */
      allowDocker?: boolean
    }),
]

const allowedStyleOptions: AllowedUsesStyle[] = [
  UsesStyle.release,
  UsesStyle.commit,
  UsesStyle.branch,
]
const defaultOptions: Options[0] = UsesStyle.release

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'enforce the style of job step uses.',
    },
    schema: [
      {
        description: 'Style for job step uses.',
        anyOf: [
          {
            type: 'string',
            description: 'Style for job step uses.',
            enum: allowedStyleOptions,
          },
          {
            type: 'object',
            description: 'Style for job step uses.',
            properties: {
              commit: {
                type: 'boolean',
                default: true,
              },
              release: {
                type: 'boolean',
                default: true,
              },
              branch: {
                type: 'boolean',
                default: true,
              },
              allowRepository: {
                type: 'boolean',
                default: false,
              },
              allowDocker: {
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
      invalidStyle: 'Invalid style for job step uses.',
      disallowStyle: 'Disallow style `{{style}}` for job step uses.',
      disallowRepository: 'Disallow using same repository action.',
      disallowDocker: 'Disallow using docker action.',
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    /* v8 ignore next guard by json-schema */
    const rawOptions = context.options?.[0] ?? defaultOptions

    const usesStyles: AllowedUsesStyle[] = []
    const ignores = isString(rawOptions)
      ? []
      : (rawOptions.ignores || []).map(ignore => new RegExp(ignore))
    const allowRepository = isString(rawOptions) ? false : rawOptions.allowRepository
    const allowDocker = isString(rawOptions) ? false : rawOptions.allowDocker

    if (isString(rawOptions)) {
      // Enum options
      /* v8 ignore next guard by json-schema */
      usesStyles.push(allowedStyleOptions.includes(rawOptions) ? rawOptions : defaultOptions)
    } else {
      // Object options
      usesStyles.push(
        ...Object.keys(rawOptions)
          .filter((key): key is AllowedUsesStyle =>
            allowedStyleOptions.includes(key as AllowedUsesStyle),
          )
          .filter(key => rawOptions[key]),
      )

      // Object options is empty, use defaultOptions
      if (usesStyles.length === 0) {
        usesStyles.push(defaultOptions)
      }
    }

    return {
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const jobsMapping = getNodeJobsMapping(node)

        if (!jobsMapping) return

        for (const job of jobsMapping.pairs) {
          const stepSequence = getNodeStepsSequence(job)

          if (!stepSequence) {
            continue
          }

          for (const step of stepSequence.entries) {
            if (!isYAMLMapping(step)) {
              continue
            }

            const usesPair = step.pairs.find(
              pair => isYAMLScalar(pair.key) && pair.key.value === 'uses',
            )

            if (!usesPair) {
              continue
            }

            // step uses is not non-empty string
            if (!isYAMLScalar(usesPair.value) || !isNonEmptyString(usesPair.value.value)) {
              context.report({
                node: usesPair,
                messageId: 'invalidStyle',
                loc: usesPair.loc,
              })
            } else {
              const usesValue = usesPair.value.value

              if (ignores.some(regex => regex.test(usesValue))) {
                continue
              }

              const { style, isRepository, isDocker } = parseJobStepUses(usesValue)

              if (isRepository) {
                if (!allowRepository) {
                  context.report({
                    node: usesPair,
                    messageId: 'disallowRepository',
                    loc: usesPair.loc,
                  })
                }
              } else if (isDocker) {
                if (!allowDocker) {
                  context.report({
                    node: usesPair,
                    messageId: 'disallowDocker',
                    loc: usesPair.loc,
                  })
                }
              } else {
                if (!usesStyles.includes(style)) {
                  context.report({
                    node: usesPair,
                    messageId: 'disallowStyle',
                    loc: usesPair.loc,
                    data: {
                      style,
                    },
                  })
                }
              }
            }
          }
        }
      },
    }
  },
})

/**
 * Parse `jobs.<job_id>.steps[*].uses`
 * @param uses - `jobs.<job_id>.steps[*].uses`
 */
function parseJobStepUses(uses: string) {
  const result: {
    style: AllowedUsesStyle
    isRepository: boolean
    isDocker: boolean
  } = {
    style: UsesStyle.branch,
    isRepository: false,
    isDocker: false,
  }
  if (uses.startsWith('./')) {
    result.isRepository = true
  } else if (uses.startsWith('docker://')) {
    result.isDocker = true
  } else {
    const [_, style] = uses.split('@')
    // commit style length is 40
    if (style.length === 40) {
      result.style = UsesStyle.commit
    } else if (style.startsWith('v')) {
      result.style = UsesStyle.release
    }
  }

  return result
}
