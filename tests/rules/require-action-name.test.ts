import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/require-action-name'
import { $, run } from '../internal'

run({
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
              "messageId": "requireActionName",
              "nodeType": "YAMLMapping",
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
              "endColumn": 13,
              "endLine": 5,
              "line": 1,
              "message": "Require action name to be set.",
              "messageId": "requireActionName",
              "nodeType": "YAMLMapping",
              "ruleId": "require-action-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
