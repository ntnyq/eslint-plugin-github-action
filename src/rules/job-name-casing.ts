import { findYAMLPair } from '../utils/ast'
import { createESLintRule } from '../utils/createRule'
import {
  checkNameCasing,
  createNameCasingChecker,
  createNameCasingSchema,
  defaultNameCasingOption,
} from '../utils/nameCasing'
import { visitWorkflow } from '../utils/workflow'
import type { NameCasingOptions } from '../utils/nameCasing'

export const RULE_NAME = 'job-name-casing'
export type MessageIds = 'jobNameNotMatch'
export type Options = NameCasingOptions

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'enforce naming convention for job names.',
    },
    fixable: 'code',
    schema: createNameCasingSchema('job name'),
    defaultOptions: [defaultNameCasingOption],
    messages: {
      jobNameNotMatch: `Job name '{{name}}' is not in {{caseTypes}}.`,
    },
  },
  create(context, [rawOptions]) {
    const checker = createNameCasingChecker(rawOptions)

    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          job(node, resolve) {
            const pair = findYAMLPair(node, 'name')
            if (pair) {
              checkNameCasing(
                context,
                checker,
                pair,
                resolve,
                'jobNameNotMatch',
              )
            }
          },
        })
      },
    }
  },
})
