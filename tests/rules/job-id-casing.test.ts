import rule, { RULE_NAME } from '../../src/rules/job-id-casing'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'no-jobs.yml',
      code: $`
        name: CI
      `,
    },
    {
      filename: 'single-word.yml',
      code: $`
        jobs:
          checkout:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
    },
    {
      filename: 'kebab-case-job.yml',
      code: $`
        jobs:
          unit-test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
    },
    {
      filename: 'kebab-case-multi-job.yml',
      code: $`
        jobs:
          unit-test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
          test-coverage:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
    },
  ],
  invalid: [
    {
      filename: 'camel-case.yml',
      code: $`
        jobs:
          unitTest:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors: [
        {
          messageId: 'jobIdNotMatch',
          line: 2,
          column: 3,
          data: {
            id: 'unitTest',
            caseTypes: 'kebab-case',
          },
        },
      ],
    },
    {
      filename: 'snake-case.yml',
      code: $`
        jobs:
          unit_test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors: [
        {
          messageId: 'jobIdNotMatch',
          line: 2,
          column: 3,
          data: {
            id: 'unit_test',
            caseTypes: 'kebab-case',
          },
        },
      ],
    },
    {
      filename: 'pascal-case.yml',
      code: $`
        jobs:
          UnitTest:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors: [
        {
          messageId: 'jobIdNotMatch',
          line: 2,
          column: 3,
          data: {
            id: 'UnitTest',
            caseTypes: 'kebab-case',
          },
        },
      ],
    },
    {
      filename: 'train-case.yml',
      code: $`
        jobs:
          Unit-Test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors: [
        {
          messageId: 'jobIdNotMatch',
          line: 2,
          column: 3,
          data: {
            id: 'Unit-Test',
            caseTypes: 'kebab-case',
          },
        },
      ],
    },
    {
      filename: 'screaming-snake-case.yml',
      code: $`
        jobs:
          UNIT_TEST:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors: [
        {
          messageId: 'jobIdNotMatch',
          line: 2,
          column: 3,
          data: {
            id: 'UNIT_TEST',
            caseTypes: 'kebab-case',
          },
        },
      ],
    },
  ],
})
