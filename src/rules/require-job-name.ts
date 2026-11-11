import { isNonEmptyString } from '@ntnyq/utils'
import { createESLintRule, isYAMLMapping, isYAMLScalar } from '../utils'
import { getPairKeyValue } from '../utils/action'
import { visitWorkflow } from '../utils/workflow'

export const RULE_NAME = 'require-job-name'
export type MessageIds = 'noName' | 'invalidName'
export type Options = []

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: false,
      description: 'require a string job name.',
    },
    schema: [],
    messages: {
      noName: 'Require job name to be set.',
      invalidName: 'Job name must be a non-empty string.',
    },
  },
  create(context) {
    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          workflow(workflow, resolve) {
            for (const jobsPair of workflow.pairs) {
              if (getPairKeyValue(jobsPair) !== 'jobs') {
                continue
              }
              const jobs = resolve(jobsPair.value)
              if (!isYAMLMapping(jobs)) {
                continue
              }
              for (const node of jobs.pairs) {
                const job = resolve(node.value)
                if (!isYAMLMapping(job)) {
                  context.report({
                    node: node.value ?? node,
                    loc: node.value?.loc ?? node.loc,
                    messageId: 'noName',
                  })
                  continue
                }
                const namePair = job.pairs.find(
                  pair => getPairKeyValue(pair) === 'name',
                )
                if (!namePair) {
                  context.report({ node, loc: node.loc, messageId: 'noName' })
                  continue
                }
                const value = resolve(namePair.value)
                if (!isYAMLScalar(value) || !isNonEmptyString(value.value)) {
                  context.report({
                    node: namePair.value ?? namePair,
                    loc: namePair.value?.loc ?? namePair.loc,
                    messageId: 'invalidName',
                  })
                }
              }
            }
          },
        })
      },
    }
  },
})
