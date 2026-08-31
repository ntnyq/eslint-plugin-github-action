import { isString } from '@ntnyq/utils'
import { VALID_TRIGGER_EVENTS } from '../constants/event'
import {
  createESLintRule,
  isYAMLMapping,
  isYAMLScalar,
  isYAMLSequence,
} from '../utils'
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
        if (node.value === null) {
          return
        }

        if (isYAMLScalar(node.value)) {
          validateEvent(node.value)
          return
        }

        if (isYAMLSequence(node.value)) {
          node.value.entries.forEach(validateEvent)
          return
        }

        if (!isYAMLMapping(node.value)) {
          context.report({
            node: node.value || node,
            loc: node.value?.loc || node.loc,
            messageId: 'invalidPair',
          })
          return
        }

        const onMapping = node.value

        // empty `on` mapping
        if (!onMapping.pairs.length) {
          return
        }

        onMapping.pairs.forEach(pair => {
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
              ...(onMapping.style === 'block'
                ? { fix: fixer => fixer.removeRange(pair.range) }
                : {}),
            })
          } else {
            context.report({
              node: pair,
              loc: pair.loc,
              messageId: 'invalidPair',
              ...(onMapping.style === 'block'
                ? { fix: fixer => fixer.removeRange(pair.range) }
                : {}),
            })
          }
        })
      },
    }

    function validateEvent(
      eventNode: YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null,
    ) {
      if (!isYAMLScalar(eventNode) || !isString(eventNode.value)) {
        context.report({
          node: eventNode || context.sourceCode.ast,
          loc: eventNode?.loc,
          messageId: 'invalidPair',
        })
        return
      }

      const event = eventNode.value

      if (VALID_TRIGGER_EVENTS.includes(event)) {
        return
      }

      context.report({
        node: eventNode,
        loc: eventNode.loc,
        data: {
          event,
        },
        messageId: 'invalidEvent',
      })
    }
  },
})
