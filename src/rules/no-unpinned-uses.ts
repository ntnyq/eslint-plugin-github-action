import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLScalar } from '../utils'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'no-unpinned-uses'
export type MessageIds = 'disallowUnpinnedDockerUses' | 'disallowUnpinnedUses'
export type Options = []

const SHA1_PATTERN = /^[\da-f]{40}$/i
const DOCKER_SHA256_PATTERN = /^docker:\/\/[^@\s]+@sha256:[\da-f]{64}$/i

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'disallow unpinned uses references.',
    },
    schema: [],
    messages: {
      disallowUnpinnedUses:
        'Disallow unpinned uses reference; pin to a full commit SHA.',
      disallowUnpinnedDockerUses:
        'Disallow unpinned Docker uses reference; pin to a full SHA-256 digest.',
    },
  },
  create(context) {
    function checkUses(node: YAMLAst.YAMLPair) {
      if (!isYAMLScalar(node.value) || !isNonEmptyString(node.value.value)) {
        return
      }

      const usesValue = node.value.value

      if (usesValue.startsWith('./')) {
        return
      }

      if (usesValue.startsWith('docker://')) {
        if (!DOCKER_SHA256_PATTERN.test(usesValue)) {
          context.report({
            node: node.value,
            loc: node.value.loc,
            messageId: 'disallowUnpinnedDockerUses',
          })
        }
        return
      }

      const atIndex = usesValue.lastIndexOf('@')
      if (atIndex === -1) {
        context.report({
          node: node.value,
          loc: node.value.loc,
          messageId: 'disallowUnpinnedUses',
        })
        return
      }

      const ref = usesValue.slice(atIndex + 1)
      if (!SHA1_PATTERN.test(ref)) {
        context.report({
          node: node.value,
          loc: node.value.loc,
          messageId: 'disallowUnpinnedUses',
        })
      }
    }

    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=uses]':
        (node: YAMLAst.YAMLPair) => {
          checkUses(node)
        },
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=steps] > YAMLSequence > YAMLMapping > YAMLPair[key.value=uses]':
        (node: YAMLAst.YAMLPair) => {
          checkUses(node)
        },
    }
  },
})
