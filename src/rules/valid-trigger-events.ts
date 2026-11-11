import { isString } from '@ntnyq/utils'
import { VALID_TRIGGER_EVENTS } from '../constants/event'
import {
  createESLintRule,
  getYAMLScalarValue,
  hasExternalYAMLAlias,
  isYAMLMapping,
  isYAMLScalar,
  isYAMLSequence,
  resolveYAMLNode,
} from '../utils'
import { getPairKeyValue } from '../utils/action'
import { visitWorkflow } from '../utils/workflow'
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
      YAMLDocument(document) {
        visitWorkflow(document, {
          workflow(mapping, resolve) {
            for (const node of mapping.pairs) {
              if (getPairKeyValue(node) !== 'on') {
                continue
              }
              validateEvents(node, resolve(node.value))
            }
          },
        })
      },
    }

    function validateEvents(
      node: YAMLAst.YAMLPair,
      value: YAMLAst.YAMLContent | null,
    ) {
      if (node.value === null) {
        return
      }

      if (isYAMLScalar(value)) {
        validateEvent(node.value)
        return
      }

      if (isYAMLSequence(value)) {
        value.entries.forEach(validateEvent)
        return
      }

      if (!isYAMLMapping(value)) {
        context.report({
          node: node.value,
          loc: node.value.loc,
          messageId: 'invalidPair',
        })
        return
      }

      const onMapping = value
      // Do not mutate an anchor definition when validating an alias at `on`.
      const canFix =
        node.value.type !== 'YAMLAlias' && onMapping.style === 'block'

      // empty `on` mapping
      if (!onMapping.pairs.length) {
        return
      }

      onMapping.pairs.forEach(pair => {
        const canRemove = canFix && !hasExternalYAMLAlias(pair)
        const event = getPairKeyValue(pair)
        if (event) {
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
            ...(canRemove
              ? { fix: fixer => fixer.removeRange(pair.range) }
              : {}),
          })
        } else {
          context.report({
            node: pair,
            loc: pair.loc,
            messageId: 'invalidPair',
            ...(canRemove
              ? { fix: fixer => fixer.removeRange(pair.range) }
              : {}),
          })
        }
      })
    }

    function validateEvent(
      eventNode: YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null,
    ) {
      const value = resolveYAMLNode(eventNode)
      const scalarValue = isYAMLScalar(value) ? getYAMLScalarValue(value) : null
      const reportNode = eventNode ?? context.sourceCode.ast
      if (!isYAMLScalar(value) || !isString(scalarValue)) {
        context.report({
          node: reportNode,
          loc: eventNode?.loc,
          messageId: 'invalidPair',
        })
        return
      }

      const event = scalarValue

      if (VALID_TRIGGER_EVENTS.includes(event)) {
        return
      }

      context.report({
        node: reportNode,
        loc: eventNode?.loc,
        data: {
          event,
        },
        messageId: 'invalidEvent',
      })
    }
  },
})
