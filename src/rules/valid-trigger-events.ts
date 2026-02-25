import { isString } from '@ntnyq/utils'
import { VALID_TRIGGER_EVENTS } from '../constants/event'
import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'valid-trigger-events'
export type MessageIds = 'invalidEvent' | 'invalidPair'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      recommended: true,
      description: 'disallow invalid trigger events.',
    },
    fixable: 'code',
    schema: [],
    messages: {
      invalidEvent: 'Disallow invalid trigger events {{event}}.',
      invalidPair: 'Disallow invalid on.event_name',
    },
  },
  create(context) {
    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=on]': (
        node: YAMLAst.YAMLPair,
      ) => {
        if (!isYAMLMapping(node.value)) {
          return
        }

        const onPairs = node.value.pairs

        // empty `on` mapping
        if (!onPairs.length) {
          return
        }

        onPairs.forEach(pair => {
          if (isYAMLScalar(pair.key) && isString(pair.key.value)) {
            const event = pair.key.value

            if (VALID_TRIGGER_EVENTS.includes(event)) {
              return
            }

            context.report({
              node: pair,
              loc: pair.loc,
              data: {
                event,
              },
              messageId: 'invalidEvent',
              fix: fixer => fixer.removeRange(pair.range),
            })
          } else {
            context.report({
              node: pair,
              loc: pair.loc,
              messageId: 'invalidPair',
              fix: fixer => fixer.removeRange(pair.range),
            })
          }
        })
      },
    }
  },
})
