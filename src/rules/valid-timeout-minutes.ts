import { isInteger, isNumber } from '@ntnyq/utils'
import { TIMEOUT_MINUTES } from '../constants/time'
import { createESLintRule, isYAMLScalar, resolveOptions } from '../utils'
import type { YAMLAst } from '../types/yaml'

type TimeoutMinutesRange = {
  min?: number
  max?: number
}

export const RULE_NAME = 'valid-timeout-minutes'
export type MessageIds = 'notInteger' | 'invalidRange'
export type Options = [
  | number
  | TimeoutMinutesRange
  | {
      job?: number | TimeoutMinutesRange
      step?: number | TimeoutMinutesRange
    },
]

const defaultOptions: Options[0] = TIMEOUT_MINUTES.default

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      recommended: true,
      description: 'disallow invalid timeout-minutes.',
    },
    schema: [
      {
        description: 'Options',
        anyOf: [
          {
            type: 'integer',
            minimum: TIMEOUT_MINUTES.min,
            maximum: TIMEOUT_MINUTES.max,
            description: 'Max value for timeout-minutes',
          },
          {
            type: 'object',
            description: 'Range value for timeout-minutes',
            properties: {
              min: {
                type: 'integer',
                minimum: TIMEOUT_MINUTES.min,
                maximum: TIMEOUT_MINUTES.max,
                description: 'Min value for timeout-minutes',
              },
              max: {
                type: 'integer',
                minimum: TIMEOUT_MINUTES.min,
                maximum: TIMEOUT_MINUTES.max,
                description: 'Max value for timeout-minutes',
              },
            },
            additionalProperties: false,
          },
          {
            type: 'object',
            description: 'Range value for timeout-minutes',
            properties: {
              job: {
                anyOf: [
                  {
                    type: 'integer',
                    minimum: TIMEOUT_MINUTES.min,
                    maximum: TIMEOUT_MINUTES.max,
                    description: 'Max value for job timeout-minutes',
                  },
                  {
                    type: 'object',
                    description: 'Range value for job timeout-minutes',
                    properties: {
                      min: {
                        type: 'integer',
                        minimum: TIMEOUT_MINUTES.min,
                        maximum: TIMEOUT_MINUTES.max,
                        description: 'Min value for job timeout-minutes',
                      },
                      max: {
                        type: 'integer',
                        minimum: TIMEOUT_MINUTES.min,
                        maximum: TIMEOUT_MINUTES.max,
                        description: 'Max value for job timeout-minutes',
                      },
                    },
                    additionalProperties: false,
                  },
                ],
              },
              step: {
                anyOf: [
                  {
                    type: 'integer',
                    minimum: TIMEOUT_MINUTES.min,
                    maximum: TIMEOUT_MINUTES.max,
                    description: 'Max value for step timeout-minutes',
                  },
                  {
                    type: 'object',
                    description: 'Range value for step timeout-minutes',
                    properties: {
                      min: {
                        type: 'integer',
                        minimum: TIMEOUT_MINUTES.min,
                        maximum: TIMEOUT_MINUTES.max,
                        description: 'Min value for step timeout-minutes',
                      },
                      max: {
                        type: 'integer',
                        minimum: TIMEOUT_MINUTES.min,
                        maximum: TIMEOUT_MINUTES.max,
                        description: 'Max value for step timeout-minutes',
                      },
                    },
                    additionalProperties: false,
                  },
                ],
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      notInteger: 'Timeout-minutes should be a positive integer.',
      invalidRange: 'Timeout-minutes range should be {{min}}-{{max}}.',
    },
  },
  create(context) {
    const rawOptions = resolveOptions(context.options, defaultOptions)
    const jobTimeoutMinutes = {
      min: TIMEOUT_MINUTES.min,
      max: TIMEOUT_MINUTES.max,
    }
    const stepTimeoutMinutes = {
      min: TIMEOUT_MINUTES.min,
      max: TIMEOUT_MINUTES.max,
    }

    if (isNumber(rawOptions)) {
      jobTimeoutMinutes.max = rawOptions
      stepTimeoutMinutes.max = rawOptions
    } else {
      if ('min' in rawOptions && rawOptions.min) {
        jobTimeoutMinutes.min = rawOptions.min
        stepTimeoutMinutes.min = rawOptions.min
      }

      if ('max' in rawOptions && rawOptions.max) {
        jobTimeoutMinutes.max = rawOptions.max
        stepTimeoutMinutes.max = rawOptions.max
      }

      if ('job' in rawOptions && rawOptions.job) {
        if (isNumber(rawOptions.job)) {
          jobTimeoutMinutes.max = rawOptions.job
        } else {
          jobTimeoutMinutes.min = rawOptions.job.min || jobTimeoutMinutes.min
          jobTimeoutMinutes.max = rawOptions.job.max || jobTimeoutMinutes.max
        }
      }

      if ('step' in rawOptions && rawOptions.step) {
        if (isNumber(rawOptions.step)) {
          stepTimeoutMinutes.max = rawOptions.step
        } else {
          stepTimeoutMinutes.min = rawOptions.step.min || stepTimeoutMinutes.min
          stepTimeoutMinutes.max = rawOptions.step.max || stepTimeoutMinutes.max
        }
      }
    }

    function validateTimeoutMinutes(
      node: YAMLAst.YAMLPair,
      range: Required<TimeoutMinutesRange>,
    ) {
      if (!isYAMLScalar(node.value)) {
        return
      }

      // positive integer
      if (
        !isNumber(node.value.value) ||
        !isInteger(node.value.value) ||
        node.value.value <= 0
      ) {
        return context.report({
          messageId: 'notInteger',
          node,
          loc: node.loc,
        })
      }

      if (node.value.value < range.min || node.value.value > range.max) {
        return context.report({
          messageId: 'invalidRange',
          node,
          loc: node.loc,
          data: {
            min: range.min,
            max: range.max,
          },
        })
      }
    }

    return {
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=timeout-minutes]':
        (node: YAMLAst.YAMLPair) => {
          return validateTimeoutMinutes(node, jobTimeoutMinutes)
        },
      'Program > YAMLDocument > YAMLMapping > YAMLPair[key.value=jobs] > YAMLMapping > YAMLPair > YAMLMapping > YAMLPair[key.value=steps] > YAMLSequence > YAMLMapping > YAMLPair[key.value=timeout-minutes]':
        (node: YAMLAst.YAMLPair) => {
          return validateTimeoutMinutes(node, stepTimeoutMinutes)
        },
    }
  },
})
