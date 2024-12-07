import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/require-action-run-name'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'valid-run-name.yml',
      code: $`
        run-name: Cut a release
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
              "message": "Require action run-name to be set.",
              "messageId": "noName",
              "nodeType": "YAMLDocument",
              "ruleId": "require-action-run-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'no-run-name.yml',
      code: $`
        name: CI
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 9,
              "endLine": 1,
              "line": 1,
              "message": "Require action run-name to be set.",
              "messageId": "noName",
              "nodeType": "YAMLMapping",
              "ruleId": "require-action-run-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'empty-run-name.yml',
      code: $`
        run-name:
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 10,
              "endLine": 1,
              "line": 1,
              "message": "Action run-name must be a non-empty string.",
              "messageId": "invalidName",
              "nodeType": "YAMLPair",
              "ruleId": "require-action-run-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'non-string-run-name.yml',
      code: $`
        run-name: [helloWorld]
        on:
          push:
            branches:
              - main
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 23,
              "endLine": 1,
              "line": 1,
              "message": "Action run-name must be a non-empty string.",
              "messageId": "invalidName",
              "nodeType": "YAMLSequence",
              "ruleId": "require-action-run-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
