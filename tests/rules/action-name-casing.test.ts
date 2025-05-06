import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/action-name-casing'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/action-name-casing'

run<Options>({
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
    {
      filename: 'invalid-option.yml',
      code: $`
        name: Unit Test
      `,
    },
    {
      filename: 'kebab-case.yml',
      code: $`
        name: unit-test
      `,
      options: ['kebab-case'],
    },
    {
      filename: 'snake-case.yml',
      code: $`
        name: unit_test
      `,
      options: ['snake_case'],
    },
    {
      filename: 'empty-object-options.yml',
      code: $`
        name: Unit Test
      `,
      options: [{}],
    },
    {
      filename: 'options-ignores.yml',
      code: $`
        name: unit_test
      `,
      options: [
        {
          ignores: ['unit_test'],
        },
      ],
    },
  ],
  invalid: [
    {
      filename: 'kebab-case.yml',
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
              "nodeType": "YAMLScalar",
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
              "nodeType": "YAMLScalar",
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
              "nodeType": "YAMLScalar",
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
              "nodeType": "YAMLScalar",
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
      output: $`
        name: Unit Test
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
              "message": "Action name 'UNIT_TEST' is not in Title Case.",
              "messageId": "actionNameNotMatch",
              "nodeType": "YAMLScalar",
              "ruleId": "action-name-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'options-kebab-case.yml',
      code: $`
        name: Unit Test
      `,
      output: $`
        name: unit-test
      `,
      options: ['kebab-case'],
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
                "text": "unit-test",
              },
              "line": 1,
              "message": "Action name 'Unit Test' is not in kebab-case.",
              "messageId": "actionNameNotMatch",
              "nodeType": "YAMLScalar",
              "ruleId": "action-name-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
