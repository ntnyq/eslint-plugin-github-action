import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/action-name-casing'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'no-name.yml',
      code: $`
        on:
          push:
            branches:
              - main
      `,
    },
    {
      filename: 'title-case.yml',
      code: $`
        name: Unit Test
      `,
    },
  ],
  invalid: [
    {
      filename: 'kebab-case',
      code: $`
        name: unit-test
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 16,
              "endLine": 1,
              "fix": {
                "range": [
                  6,
                  15,
                ],
                "text": "Unit Test",
              },
              "line": 1,
              "message": "Action name 'unit-test' is not in Title Case.",
              "messageId": "actionNameNotMatch",
              "nodeType": "YAMLMapping",
              "ruleId": "action-name-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'snake-case.yml',
      code: $`
        name: unit_test
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 16,
              "endLine": 1,
              "fix": {
                "range": [
                  6,
                  15,
                ],
                "text": "Unit Test",
              },
              "line": 1,
              "message": "Action name 'unit_test' is not in Title Case.",
              "messageId": "actionNameNotMatch",
              "nodeType": "YAMLMapping",
              "ruleId": "action-name-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'camel-case.yml',
      code: $`
        name: unitTest
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 15,
              "endLine": 1,
              "fix": {
                "range": [
                  6,
                  14,
                ],
                "text": "Unit Test",
              },
              "line": 1,
              "message": "Action name 'unitTest' is not in Title Case.",
              "messageId": "actionNameNotMatch",
              "nodeType": "YAMLMapping",
              "ruleId": "action-name-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'pascal-case.yml',
      code: $`
        name: UnitTest
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 15,
              "endLine": 1,
              "fix": {
                "range": [
                  6,
                  14,
                ],
                "text": "Unit Test",
              },
              "line": 1,
              "message": "Action name 'UnitTest' is not in Title Case.",
              "messageId": "actionNameNotMatch",
              "nodeType": "YAMLMapping",
              "ruleId": "action-name-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'screaming-snake-case.yml',
      code: $`
        name: UNIT_TEST
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 16,
              "endLine": 1,
              "fix": {
                "range": [
                  6,
                  15,
                ],
                "text": "UNIT TEST",
              },
              "line": 1,
              "message": "Action name 'UNIT_TEST' is not in Title Case.",
              "messageId": "actionNameNotMatch",
              "nodeType": "YAMLMapping",
              "ruleId": "action-name-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
