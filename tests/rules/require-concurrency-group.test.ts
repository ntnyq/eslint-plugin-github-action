import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/require-concurrency-group'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/require-concurrency-group'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'concurrency-string.yml',
      code: $`
        name: CI
        concurrency: ci-
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - run: echo "ok"
      `,
    },
    {
      filename: 'concurrency-group.yml',
      code: $`
        name: CI
        concurrency:
          group: ci-
          cancel-in-progress: true
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - run: echo "ok"
      `,
    },
  ],
  invalid: [
    {
      filename: 'empty.yml',
      code: '',
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 1,
              "endLine": 1,
              "line": 1,
              "message": "Require top-level concurrency group to be set.",
              "messageId": "noConcurrencyGroup",
              "ruleId": "require-concurrency-group",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'missing-concurrency.yml',
      code: $`
        name: CI
        on:
          push:
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
              "endColumn": 23,
              "endLine": 8,
              "line": 1,
              "message": "Require top-level concurrency group to be set.",
              "messageId": "noConcurrencyGroup",
              "ruleId": "require-concurrency-group",
              "severity": 2,
            },
          ]
        `)
      },
    },
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
              "message": "Top-level concurrency group must be a non-empty string.",
              "messageId": "invalidConcurrencyGroup",
              "ruleId": "require-concurrency-group",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'missing-group.yml',
      code: $`
        name: CI
        concurrency:
          cancel-in-progress: true
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
              "endColumn": 27,
              "endLine": 3,
              "line": 3,
              "message": "Top-level concurrency group must be a non-empty string.",
              "messageId": "invalidConcurrencyGroup",
              "ruleId": "require-concurrency-group",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'empty-string-concurrency.yml',
      code: $`
        name: CI
        concurrency: ''
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
              "endColumn": 16,
              "endLine": 2,
              "line": 2,
              "message": "Top-level concurrency group must be a non-empty string.",
              "messageId": "invalidConcurrencyGroup",
              "ruleId": "require-concurrency-group",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
