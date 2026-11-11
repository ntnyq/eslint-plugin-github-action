import {
  VALID_CONTAINER_KEYS,
  VALID_JOB_KEYS,
  VALID_SERVICE_KEYS,
  VALID_STEP_KEYS,
  VALID_STRATEGY_KEYS,
  VALID_TOP_LEVEL_KEYS,
} from '../constants/key'
import { createESLintRule } from '../utils'
import { getPairKeyValue } from '../utils/action'
import { visitWorkflow } from '../utils/workflow'
import type { RuleContext } from '../types/eslint'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'no-invalid-key'
export type MessageIds =
  | 'invalidTopLevelKey'
  | 'invalidJobKey'
  | 'invalidStepKey'
  | 'invalidServiceKey'
  | 'invalidStrategyKey'
  | 'invalidContainerKey'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: true,
      description: 'disallow using invalid key.',
    },
    schema: [],
    messages: {
      invalidTopLevelKey: 'invalid top-level key `{{key}}`.',
      invalidJobKey: 'invalid job key `{{key}}`.',
      invalidStepKey: 'invalid step key `{{key}}`.',
      invalidStrategyKey: 'invalid strategy key `{{key}}`.',
      invalidContainerKey: 'invalid container key `{{key}}`.',
      invalidServiceKey: 'invalid service key `{{key}}`.',
    },
  },
  create(context) {
    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          workflow(node) {
            validateMappingKeys({
              context,
              node,
              validKeys: VALID_TOP_LEVEL_KEYS,
              messageId: 'invalidTopLevelKey',
            })
          },
          job(node) {
            validateMappingKeys({
              context,
              node,
              validKeys: VALID_JOB_KEYS,
              messageId: 'invalidJobKey',
            })
          },
          strategy(node) {
            validateMappingKeys({
              context,
              node,
              validKeys: VALID_STRATEGY_KEYS,
              messageId: 'invalidStrategyKey',
            })
          },
          container(node) {
            validateMappingKeys({
              context,
              node,
              validKeys: VALID_CONTAINER_KEYS,
              messageId: 'invalidContainerKey',
            })
          },
          service(node) {
            validateMappingKeys({
              context,
              node,
              validKeys: VALID_SERVICE_KEYS,
              messageId: 'invalidServiceKey',
            })
          },
          step(node) {
            validateMappingKeys({
              context,
              node,
              validKeys: VALID_STEP_KEYS,
              messageId: 'invalidStepKey',
            })
          },
        })
      },
    }
  },
})

function validateMappingKeys({
  context,
  node,
  validKeys,
  messageId,
}: {
  context: RuleContext<MessageIds, Options>
  node: YAMLAst.YAMLMapping
  validKeys: string[]
  messageId: MessageIds
}) {
  for (const pair of node.pairs) {
    const pairKeyValue = getPairKeyValue(pair)

    if (
      // key.value is not a string
      !pairKeyValue ||
      // key.value is valid
      validKeys.includes(pairKeyValue)
    ) {
      continue
    }

    context.report({
      node,
      loc: pair.key?.loc,
      messageId,
      data: {
        key: pairKeyValue,
      },
    })
  }
}
