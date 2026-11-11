import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, getYAMLScalarValue, isYAMLScalar } from '../utils'
import { getPairKeyValue } from '../utils/action'
import { visitWorkflow } from '../utils/workflow'
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
    function checkUses(
      node: YAMLAst.YAMLPair,
      value: YAMLAst.YAMLContent | null,
    ) {
      const scalarValue = isYAMLScalar(value) ? getYAMLScalarValue(value) : null
      if (
        !node.value ||
        !isYAMLScalar(value) ||
        !isNonEmptyString(scalarValue)
      ) {
        return
      }

      const usesValue = scalarValue

      if (usesValue.startsWith('./')) {
        return
      }

      if (usesValue.startsWith('docker://')) {
        if (!DOCKER_SHA256_PATTERN.test(usesValue)) {
          context.report({
            node: node.value,
            messageId: 'disallowUnpinnedDockerUses',
          })
        }
        return
      }

      const atIndex = usesValue.lastIndexOf('@')
      if (atIndex === -1) {
        context.report({
          node: node.value,
          messageId: 'disallowUnpinnedUses',
        })
        return
      }

      const ref = usesValue.slice(atIndex + 1)
      if (!SHA1_PATTERN.test(ref)) {
        context.report({
          node: node.value,
          messageId: 'disallowUnpinnedUses',
        })
      }
    }

    function checkMapping(
      node: YAMLAst.YAMLMapping,
      resolve: (node: YAMLAst.YAMLPair['value']) => YAMLAst.YAMLContent | null,
    ) {
      for (const pair of node.pairs) {
        if (getPairKeyValue(pair) === 'uses') {
          checkUses(pair, resolve(pair.value))
        }
      }
    }
    return {
      YAMLDocument(document) {
        const visitors = {
          job: checkMapping,
          step: checkMapping,
        }
        visitWorkflow(document, visitors)
      },
    }
  },
})
