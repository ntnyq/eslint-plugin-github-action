import {
  validContainerKeys,
  validJobKeys,
  validServiceKeys,
  validStepKeys,
  validStrategyKeys,
  validTopLevelKeys,
} from '../constants/key'
import { createESLintRule } from '../utils'
import { getPairKeyValue } from '../utils/action'
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
      'Program > YAMLDocument > YAMLMapping': (node: YAMLAst.YAMLMapping) => {
        validateMappingKeys({
          context,
          node,
          validKeys: validTopLevelKeys,
          messageId: 'invalidTopLevelKey',
        })
      },

      // checks all jobs keys
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping':
        (node: YAMLAst.YAMLMapping) => {
          validateMappingKeys({
            context,
            node,
            validKeys: validJobKeys,
            messageId: 'invalidJobKey',
          })
        },

      // checks all jobs strategy keys
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=strategy] > YAMLMapping':
        (node: YAMLAst.YAMLMapping) => {
          validateMappingKeys({
            context,
            node,
            validKeys: validStrategyKeys,
            messageId: 'invalidStrategyKey',
          })
        },

      // checks all jobs container keys
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=container] > YAMLMapping':
        (node: YAMLAst.YAMLMapping) => {
          validateMappingKeys({
            context,
            node,
            validKeys: validContainerKeys,
            messageId: 'invalidContainerKey',
          })
        },

      // checks all steps services keys
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=services] > YAMLMapping > YAMLPair > YAMLMapping':
        (node: YAMLAst.YAMLMapping) => {
          validateMappingKeys({
            context,
            node,
            validKeys: validServiceKeys,
            messageId: 'invalidServiceKey',
          })
        },

      // checks all steps keys
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=steps] > YAMLSequence > YAMLMapping':
        (node: YAMLAst.YAMLMapping) => {
          validateMappingKeys({
            context,
            node,
            validKeys: validStepKeys,
            messageId: 'invalidStepKey',
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
