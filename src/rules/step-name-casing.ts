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

export const RULE_NAME = 'step-name-casing'
export type MessageIds = 'stepNameNotMatch'
export type Options = NameCasingOptions

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'enforce naming convention for job step names.',
    },
    fixable: 'code',
    schema: createNameCasingSchema('job step name'),
    defaultOptions: [defaultNameCasingOption],
    messages: {
      stepNameNotMatch: `Job step name '{{name}}' is not in {{caseTypes}}.`,
    },
  },
  create(context, [rawOptions]) {
    const checker = createNameCasingChecker(rawOptions)

    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          step(node, resolve) {
            const pair = findYAMLPair(node, 'name')
            if (pair) {
              checkNameCasing(
                context,
                checker,
                pair,
                resolve,
                'stepNameNotMatch',
              )
            }
          },
        })
      },
    }
  },
})
