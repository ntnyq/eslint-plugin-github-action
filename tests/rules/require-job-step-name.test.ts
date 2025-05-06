import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/require-job-step-name'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/require-job-step-name'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'no-jobs.yml',
      code: $`
        name: Release
        jobs:
      `,
    },
    {
      filename: 'no-job-steps.yml',
      code: $`
        name: Release
        jobs:
          test:
            name: Test
      `,
    },
    {
      filename: 'job-is-invalid.yml',
      code: $`
        name: Release
        jobs:
          test: helloWorld
      `,
    },
    {
      filename: 'job-steps-not-sequence.yml',
      code: $`
        name: Release
        jobs:
          test:
            steps: helloWorld
      `,
    },
    {
      filename: 'all-job-steps-have-name.yml',
      code: $`
        name: Release
        jobs:
          test:
            name: Test
            steps:
              - name: Lint
              - name: Typecheck
      `,
    },
  ],
  invalid: [
    {
      filename: 'job-step-has-no-name.yml',
      code: $`
        name: Release
        jobs:
          test:
            name: Test
            steps:
              - name: Lint
              - run: echo hello world
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 30,
              "endLine": 7,
              "line": 7,
              "message": "Require job step name to be set.",
              "messageId": "noName",
              "nodeType": "YAMLMapping",
              "ruleId": "require-job-step-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'job-step-name-is-empty.yml',
      code: $`
        name: Release
        jobs:
          test:
            name: Test
            steps:
              - name:
                run: echo hello world
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 14,
              "endLine": 6,
              "line": 6,
              "message": "Job step name must be a non-empty string.",
              "messageId": "invalidName",
              "nodeType": "YAMLPair",
              "ruleId": "require-job-step-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'job-step-name-is-not-string.yml',
      code: $`
        name: Release
        jobs:
          test:
            name: Test
            steps:
              - name:
                  - Test
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 17,
              "endLine": 7,
              "line": 7,
              "message": "Job step name must be a non-empty string.",
              "messageId": "invalidName",
              "nodeType": "YAMLSequence",
              "ruleId": "require-job-step-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'every-job-no-name.yml',
      code: $`
        name: Release
        jobs:
          test:
            name: Test
            steps:
              - run: echo hello world
              - run: echo hello world
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 30,
              "endLine": 6,
              "line": 6,
              "message": "Require job step name to be set.",
              "messageId": "noName",
              "nodeType": "YAMLMapping",
              "ruleId": "require-job-step-name",
              "severity": 2,
            },
            {
              "column": 9,
              "endColumn": 30,
              "endLine": 7,
              "line": 7,
              "message": "Require job step name to be set.",
              "messageId": "noName",
              "nodeType": "YAMLMapping",
              "ruleId": "require-job-step-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
