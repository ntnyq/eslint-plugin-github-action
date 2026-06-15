import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/prefer-cancel-in-progress'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/prefer-cancel-in-progress'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'top-level-enabled.yml',
      code: $`
        name: CI
        concurrency:
          group: ci-main
          cancel-in-progress: true
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - run: echo "ok"
      `,
    },
    {
      filename: 'job-level-enabled.yml',
      code: $`
        name: CI
        jobs:
          test:
            runs-on: ubuntu-latest
            concurrency:
              group: ci-test
              cancel-in-progress: true
            steps:
              - run: echo "ok"
      `,
    },
  ],
  invalid: [
    {
      filename: 'empty-concurrency.yml',
      code: $`
        name: CI
        concurrency:
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - run: echo "ok"
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 13,
              "endLine": 2,
              "line": 2,
              "message": "Prefer setting concurrency cancel-in-progress to true.",
              "messageId": "preferCancelInProgress",
              "ruleId": "prefer-cancel-in-progress",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'concurrency-string.yml',
      code: $`
        name: CI
        concurrency: ci-main
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - run: echo "ok"
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 21,
              "endLine": 2,
              "line": 2,
              "message": "Prefer setting concurrency cancel-in-progress to true.",
              "messageId": "preferCancelInProgress",
              "ruleId": "prefer-cancel-in-progress",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'missing-cancel-in-progress.yml',
      code: $`
        name: CI
        concurrency:
          group: ci-main
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - run: echo "ok"
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 17,
              "endLine": 3,
              "line": 3,
              "message": "Prefer setting concurrency cancel-in-progress to true.",
              "messageId": "preferCancelInProgress",
              "ruleId": "prefer-cancel-in-progress",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'cancel-in-progress-false.yml',
      code: $`
        name: CI
        concurrency:
          group: ci-main
          cancel-in-progress: false
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - run: echo "ok"
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 23,
              "endColumn": 28,
              "endLine": 4,
              "line": 4,
              "message": "Prefer setting concurrency cancel-in-progress to true.",
              "messageId": "preferCancelInProgress",
              "ruleId": "prefer-cancel-in-progress",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'job-level-missing-cancel.yml',
      code: $`
        name: CI
        jobs:
          test:
            runs-on: ubuntu-latest
            concurrency:
              group: ci-test
            steps:
              - run: echo "ok"
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 21,
              "endLine": 6,
              "line": 6,
              "message": "Prefer setting concurrency cancel-in-progress to true.",
              "messageId": "preferCancelInProgress",
              "ruleId": "prefer-cancel-in-progress",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
