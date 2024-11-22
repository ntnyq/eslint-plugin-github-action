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
      errors: [
        {
          messageId: 'actionNameNotMatch',
          line: 1,
          column: 7,
          data: {
            name: 'unit-test',
            caseType: 'Title Case',
          },
        },
      ],
    },
    {
      filename: 'snake-case.yml',
      code: $`
        name: unit_test
      `,
      errors: [
        {
          messageId: 'actionNameNotMatch',
          line: 1,
          column: 7,
          data: {
            name: 'unit_test',
            caseType: 'Title Case',
          },
        },
      ],
    },
    {
      filename: 'camel-case.yml',
      code: $`
        name: unitTest
      `,
      errors: [
        {
          messageId: 'actionNameNotMatch',
          line: 1,
          column: 7,
          data: {
            name: 'unitTest',
            caseType: 'Title Case',
          },
        },
      ],
    },
    {
      filename: 'pascal-case.yml',
      code: $`
        name: UnitTest
      `,
      errors: [
        {
          messageId: 'actionNameNotMatch',
          line: 1,
          column: 7,
          data: {
            name: 'UnitTest',
            caseType: 'Title Case',
          },
        },
      ],
    },
    {
      filename: 'screaming-snake-case.yml',
      code: $`
        name: UNIT_TEST
      `,
      errors: [
        {
          messageId: 'actionNameNotMatch',
          line: 1,
          column: 7,
          data: {
            name: 'UNIT_TEST',
            caseType: 'Title Case',
          },
        },
      ],
    },
  ],
})
