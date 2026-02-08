import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/require-action-name'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/require-action-name'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'valid-name.yml',
      code: $`
        name: Release
        on:
          push:
            branches:
              - main
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
              "message": "Require action name to be set.",
              "messageId": "noName",
              "ruleId": "require-action-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'no-name.yml',
      code: $`
        on:
          push:
            branches:
              - main
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 13,
              "endLine": 4,
              "line": 1,
              "message": "Require action name to be set.",
              "messageId": "noName",
              "ruleId": "require-action-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'empty-name.yml',
      code: $`
        name:
        on:
          push:
            branches:
              - main
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 6,
              "endLine": 1,
              "line": 1,
              "message": "Action name must be a non-empty string.",
              "messageId": "invalidName",
              "ruleId": "require-action-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'non-string-name.yml',
      code: $`
        name: [helloWorld]
        on:
          push:
            branches:
              - main
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 19,
              "endLine": 1,
              "line": 1,
              "message": "Action name must be a non-empty string.",
              "messageId": "invalidName",
              "ruleId": "require-action-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
