import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/valid-timeout-minutes'
import { $, run } from '../helpers/rule-tester'
import type { Options } from '../../src/rules/valid-timeout-minutes'

const customOptions: Options[] = [
  [1440],
  [{ max: 1440 }],
  [{ job: 60 }],
  [{}],
  [{ step: {} }],
]

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'expressions.yml',
      code: $`
        jobs:
          test:
            timeout-minutes: \${{ matrix.timeout }}
            steps:
              - timeout-minutes: \${{ fromJSON(vars.TIMEOUT) }}
      `,
    },
    ...customOptions.map(options => ({
      filename: 'step-upper-bound.yml',
      options,
      code: 'jobs:\n  test:\n    steps:\n      - timeout-minutes: 360',
    })),
    {
      filename: 'job-upper-bound.yml',
      options: [{ job: 1440 }],
      code: 'jobs:\n  test:\n    timeout-minutes: 1440',
    },
    {
      filename: 'anchored-expressions.yml',
      code: $`
        jobs:
          test:
            timeout-minutes: &timeout \${{ matrix.timeout }}
            steps:
              - parallel:
                  - timeout-minutes: *timeout
                  - timeout-minutes: >-
                      \${{ fromJSON(vars.TIMEOUT) }}
      `,
    },
    {
      filename: 'empty.yml',
      code: '',
    },
    {
      filename: 'empty-jobs.yml',
      code: $`
        jobs: {}
      `,
    },
    {
      filename: 'valid-job.yml',
      code: $`
        jobs:
          unit-test:
            timeout-minutes: 10
      `,
    },
    {
      filename: 'valid-step.yml',
      code: $`
        jobs:
          unit-test:
            steps:
              - timeout-minutes: 10
      `,
    },
    {
      filename: 'option-number.yml',
      options: [20],
      code: $`
        jobs:
          unit-test:
            steps:
              - timeout-minutes: 20
      `,
    },
  ],
  invalid: [
    ...customOptions.map(options => ({
      filename: 'step-above-upper-bound.yml',
      options,
      code: 'jobs:\n  test:\n    steps:\n      - timeout-minutes: 361',
      errors: [
        { messageId: 'invalidRange' as const, data: { min: 1, max: 360 } },
      ],
    })),
    ...[
      '"20"',
      `"prefix \${{ matrix.timeout }}"`,
      `"\${{ }}"`,
      '"${{ matrix.timeout"',
      'true',
    ].map(value => ({
      filename: 'invalid-static-value.yml',
      code: `jobs:\n  test:\n    timeout-minutes: ${value}`,
      errors: [{ messageId: 'notInteger' as const }],
    })),
    {
      filename: 'custom-job-keeps-step-limit.yml',
      options: [{ job: 60 }],
      code: 'jobs:\n  test:\n    steps:\n      - timeout-minutes: 1000',
      errors: [{ messageId: 'invalidRange', data: { min: 1, max: 360 } }],
    },
    {
      filename: 'anchored-parallel.yml',
      code: 'jobs:\n  test: &test\n    steps:\n      - parallel:\n          - timeout-minutes: &timeout 0\n          - timeout-minutes: *timeout',
      errors: [{ messageId: 'notInteger' }, { messageId: 'notInteger' }],
    },
    {
      filename: 'mapping-job.yml',
      code: $`
        jobs:
          unit-test:
            timeout-minutes: {}
      `,
      errors: [{ messageId: 'notInteger' }],
    },
    {
      filename: 'null-job.yml',
      code: $`
        jobs:
          unit-test:
            timeout-minutes:
      `,
      errors: [{ messageId: 'notInteger' }],
    },
    {
      filename: 'sequence-step.yml',
      code: $`
        jobs:
          unit-test:
            steps:
              - timeout-minutes: [10]
      `,
      errors: [{ messageId: 'notInteger' }],
    },
    {
      filename: 'not-number-job.yml',
      code: $`
        jobs:
          unit-test:
            timeout-minutes: foobar
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              timeout-minutes: foobar"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 28,
              "endLine": 3,
              "line": 3,
              "message": "Timeout-minutes should be a positive integer.",
              "messageId": "notInteger",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'not-integer-job.yml',
      code: $`
        jobs:
          unit-test:
            timeout-minutes: 2.3
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              timeout-minutes: 2.3"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 25,
              "endLine": 3,
              "line": 3,
              "message": "Timeout-minutes should be a positive integer.",
              "messageId": "notInteger",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'negative-integer-job.yml',
      code: $`
        jobs:
          unit-test:
            timeout-minutes: -10
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              timeout-minutes: -10"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 25,
              "endLine": 3,
              "line": 3,
              "message": "Timeout-minutes should be a positive integer.",
              "messageId": "notInteger",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'not-integer-step.yml',
      code: $`
        jobs:
          unit-test:
            steps:
              - timeout-minutes: foobar
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              steps:
                - timeout-minutes: foobar"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 32,
              "endLine": 4,
              "line": 4,
              "message": "Timeout-minutes should be a positive integer.",
              "messageId": "notInteger",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'option-number.yml',
      options: [20],
      code: $`
        jobs:
          unit-test:
            steps:
              - timeout-minutes: 30
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              steps:
                - timeout-minutes: 30"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 28,
              "endLine": 4,
              "line": 4,
              "message": "Timeout-minutes range should be 1-20.",
              "messageId": "invalidRange",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'option-range.yml',
      options: [
        {
          min: 10,
          max: 20,
        },
      ],
      code: $`
        jobs:
          unit-test:
            steps:
              - timeout-minutes: 30
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              steps:
                - timeout-minutes: 30"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 28,
              "endLine": 4,
              "line": 4,
              "message": "Timeout-minutes range should be 10-20.",
              "messageId": "invalidRange",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'option-job-number.yml',
      options: [
        {
          job: 20,
        },
      ],
      code: $`
        jobs:
          unit-test:
            timeout-minutes: 30
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              timeout-minutes: 30"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 24,
              "endLine": 3,
              "line": 3,
              "message": "Timeout-minutes range should be 1-20.",
              "messageId": "invalidRange",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'option-job-range-min.yml',
      options: [
        {
          job: {
            min: 40,
          },
        },
      ],
      code: $`
        jobs:
          unit-test:
            timeout-minutes: 30
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              timeout-minutes: 30"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 24,
              "endLine": 3,
              "line": 3,
              "message": "Timeout-minutes range should be 40-1440.",
              "messageId": "invalidRange",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'option-job-range-max.yml',
      options: [
        {
          job: {
            max: 20,
          },
        },
      ],
      code: $`
        jobs:
          unit-test:
            timeout-minutes: 30
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              timeout-minutes: 30"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 24,
              "endLine": 3,
              "line": 3,
              "message": "Timeout-minutes range should be 1-20.",
              "messageId": "invalidRange",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'option-step-number.yml',
      options: [
        {
          step: 20,
        },
      ],
      code: $`
        jobs:
          unit-test:
            steps:
              - timeout-minutes: 30
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              steps:
                - timeout-minutes: 30"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 28,
              "endLine": 4,
              "line": 4,
              "message": "Timeout-minutes range should be 1-20.",
              "messageId": "invalidRange",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'option-step-range-min.yml',
      options: [
        {
          step: {
            min: 40,
          },
        },
      ],
      code: $`
        jobs:
          unit-test:
            steps:
              - timeout-minutes: 30
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              steps:
                - timeout-minutes: 30"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 28,
              "endLine": 4,
              "line": 4,
              "message": "Timeout-minutes range should be 40-360.",
              "messageId": "invalidRange",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'option-step-range-max.yml',
      options: [
        {
          step: {
            max: 20,
          },
        },
      ],
      code: $`
        jobs:
          unit-test:
            steps:
              - timeout-minutes: 30
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "jobs:
            unit-test:
              steps:
                - timeout-minutes: 30"
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 28,
              "endLine": 4,
              "line": 4,
              "message": "Timeout-minutes range should be 1-20.",
              "messageId": "invalidRange",
              "ruleId": "valid-timeout-minutes",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
