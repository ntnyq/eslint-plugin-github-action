import { isNonEmptyString, isString } from '@ntnyq/utils'
import { createESLintRule, isYAMLScalar, resolveOptions } from '../utils'
import type { YAMLAst } from '../types/yaml'

const UsesStyle = {
  commit: 'commit',
  release: 'release',
  branch: 'branch',
} as const

type AllowedUsesStyle = keyof typeof UsesStyle

export const RULE_NAME = 'prefer-step-uses-style'
export type MessageIds =
  | 'invalidStyle'
  | 'disallowRepository'
  | 'disallowDocker'
  | 'disallowStyle'
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
              },
              release: {
                type: 'boolean',
              },
              branch: {
                type: 'boolean',
              },
              allowRepository: {
                type: 'boolean',
              },
              allowDocker: {
                type: 'boolean',
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
    const rawOptions = resolveOptions(context.options, defaultOptions)

    const usesStyles: AllowedUsesStyle[] = []
    const ignores = isString(rawOptions)
      ? []
      : (rawOptions.ignores || []).map(ignore => new RegExp(ignore))
    const allowRepository = isString(rawOptions)
      ? false
      : rawOptions.allowRepository
    const allowDocker = isString(rawOptions) ? false : rawOptions.allowDocker

    if (isString(rawOptions)) {
      // Enum options
      /* v8 ignore start guard by json-schema */
      usesStyles.push(
        allowedStyleOptions.includes(rawOptions) ? rawOptions : defaultOptions,
      )
      /* v8 ignore end guard by json-schema */
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
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=steps] > YAMLSequence > YAMLMapping > YAMLPair[key.value=uses]':
        (node: YAMLAst.YAMLPair) => {
          // step uses is not non-empty string
          if (
            !isYAMLScalar(node.value)
            || !isNonEmptyString(node.value.value)
          ) {
            context.report({
              node: node.value || node,
              messageId: 'invalidStyle',
              loc: node.value?.loc || node.loc,
            })
          } else {
            const usesValue = node.value.value

            if (ignores.some(regex => regex.test(usesValue))) {
              return
            }

            const { style, isRepository, isDocker } =
              parseJobStepUses(usesValue)

            if (isRepository) {
              if (!allowRepository) {
                context.report({
                  node: node.value,
                  messageId: 'disallowRepository',
                  loc: node.value.loc,
                })
              }
            } else if (isDocker) {
              if (!allowDocker) {
                context.report({
                  node: node.value,
                  messageId: 'disallowDocker',
                  loc: node.value.loc,
                })
              }
            } else {
              if (!usesStyles.includes(style)) {
                context.report({
                  node: node.value,
                  messageId: 'disallowStyle',
                  loc: node.value.loc,
                  data: {
                    style,
                  },
                })
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
