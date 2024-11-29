import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import { getNodeJobsMapping } from '../utils/action'
import type { ASTNode } from '../types'
import type { YAMLAst } from '../types/yaml'

const UsesStyle = {
  sha: 'sha',
  tag: 'tag',
  branch: 'branch',
} as const

type AllowedUsesStyle = 'tag' | 'sha' | 'branch'

export const RULE_NAME = 'prefer-job-step-uses'
export type MessageIds =
  // 'noRepositoryAction' |
  // 'noDockerAction' |
  'disallowActionStyle'
export type Options = [
  | AllowedUsesStyle
  | ({ [key in AllowedUsesStyle]?: boolean } & {
      /**
       * Ignore patterns
       */
      ignores?: string[]

      /**
       * Support using an action inside the repository.
       *
       * @default false
       */
      repository?: boolean

      /**
       * Support using an action from:
       * - Docker Hub action
       * - GitHub Packages Container registry.
       * - Docker public registry action
       *
       * @default false
       */
      docker?: boolean
    }),
]

const allowedStyleOptions: AllowedUsesStyle[] = [UsesStyle.tag, UsesStyle.sha, UsesStyle.branch]
const defaultOptions: Options[0] = UsesStyle.tag

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
        ],
      },
    ],
    messages: {
      disallowActionStyle: 'Disallow using external job.',
      // noRepositoryAction: 'Disallow using repository action.',
      // noDockerAction: 'Disallow using Docker action.',
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        const jobsMapping = getNodeJobsMapping(node)

        if (!jobsMapping) return

        for (const job of jobsMapping.pairs) {
          if (isYAMLMapping(job.value)) {
            const usesPair = job.value.pairs.find(
              pair => isYAMLScalar(pair.key) && pair.key.value === 'uses',
            )

            if (usesPair) {
              context.report({
                node: node as unknown as ASTNode,
                loc: usesPair.loc,
                messageId: 'disallowActionStyle',
              })
            }
          }
        }
      },
    }
  },
})
