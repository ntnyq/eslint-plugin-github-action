import { getPairKeyValue } from '../utils/ast'
import { createESLintRule } from '../utils/createRule'
import {
  checkNameCasing,
  createNameCasingChecker,
  createNameCasingSchema,
  defaultNameCasingOption,
} from '../utils/nameCasing'
import { visitWorkflow } from '../utils/workflow'
import type { NameCasingOptions } from '../utils/nameCasing'

export const RULE_NAME = 'action-name-casing'
export type MessageIds = 'actionNameNotMatch'
export type Options = NameCasingOptions

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'enforce naming convention for workflow name.',
    },
    fixable: 'code',
    schema: createNameCasingSchema('action name'),
    defaultOptions: [defaultNameCasingOption],
    messages: {
      actionNameNotMatch: `Action name '{{name}}' is not in {{caseTypes}}.`,
    },
  },
  create(context, [rawOptions]) {
    const checker = createNameCasingChecker(rawOptions)

    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          workflow(mapping, resolve) {
            for (const pair of mapping.pairs) {
              if (getPairKeyValue(pair) === 'name') {
                checkNameCasing(
                  context,
                  checker,
                  pair,
                  resolve,
                  'actionNameNotMatch',
                )
              }
            }
          },
        })
      },
    }
  },
})
