/**
 * @copyright https://github.com/ota-meshi/eslint-plugin-yml
 * @license MIT {@link https://github.com/ota-meshi/eslint-plugin-yml/blob/master/LICENSE}
 */

import { isString } from '@ntnyq/utils'
import { createESLintRule, resolveOptions } from '../utils'
import type { YAMLAst } from '../types/yaml'

const actionExtension = {
  yml: 'yml',
  yaml: 'yaml',
} as const

type AvailableExtension = keyof typeof actionExtension

export const RULE_NAME = 'prefer-file-extension'
export type MessageIds = 'unexpected'
export type Options = [
  | AvailableExtension
  | {
      extension?: AvailableExtension
      caseSensitive?: boolean
    },
]

const allowedExtensionOptions: AvailableExtension[] = [
  actionExtension.yml,
  actionExtension.yaml,
]
const defaultOptions: Options[0] = actionExtension.yml

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: true,
      description: 'enforce action file extension.',
    },
    schema: [
      {
        description: 'Action file extension.',
        anyOf: [
          {
            type: 'string',
            description: 'Action file extension.',
            enum: allowedExtensionOptions,
          },
          {
            type: 'object',
            description: 'Action file extension.',
            properties: {
              extension: {
                type: 'string',
                enum: allowedExtensionOptions,
              },
              caseSensitive: {
                type: 'boolean',
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      unexpected: 'Expected extension `{{expected}}`, but got `{{actual}}`.',
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const rawOptions = resolveOptions(context.options, defaultOptions)

    const extension = isString(rawOptions)
      ? rawOptions
      : (rawOptions.extension ?? defaultOptions)
    const caseSensitive = isString(rawOptions) ? true : rawOptions.caseSensitive

    return {
      Program: (node: YAMLAst.YAMLProgram) => {
        const filename = context.filename
        const fileExtension = filename.split('.').pop()

        // No extension
        if (!filename.includes('.') || !fileExtension) {
          return
        }

        if (
          (caseSensitive ? fileExtension : fileExtension.toLowerCase()) ===
          extension
        ) {
          return
        }

        context.report({
          node,
          loc: node.loc,
          messageId: 'unexpected',
          data: {
            expected: extension,
            actual: fileExtension,
          },
        })
      },
    }
  },
})
